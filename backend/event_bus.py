"""
AWS EventBridge Asynchronous Event Dispatcher
================================================
Decouples agent handoff stages:
  - campaign.draft_created -> Archive Bedrock Guardrails check
  - campaign.approved -> Atlas PM task update & Step Functions Video render
  - lead.status.changed -> Atlas 4-phase rollout initiation
"""
import os
import json
import boto3
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
EVENT_BUS_NAME = os.getenv("EVENT_BUS_NAME", "kaiso-event-bus")

class EventBridgeDispatcher:
    def __init__(self):
        self.region = AWS_REGION
        self.bus_name = EVENT_BUS_NAME
        self.client = None

        aws_key = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")
        if aws_key and aws_secret:
            try:
                self.client = boto3.client(
                    "events",
                    region_name=self.region,
                    aws_access_key_id=aws_key,
                    aws_secret_access_key=aws_secret
                )
            except Exception as e:
                print(f"[EventBridge Init Notice]: {e}")

    def emit_event(self, event_type: str, detail: Dict[str, Any]) -> Dict[str, Any]:
        """Publishes an event to AWS EventBridge or logs local event bus trigger."""
        payload = {
            "EventBusName": self.bus_name,
            "Source": "kaiso.agent_os",
            "DetailType": event_type,
            "Detail": json.dumps(detail)
        }

        if self.client:
            try:
                res = self.client.put_events(Entries=[payload])
                return {"status": "EMITTED", "event": event_type, "aws_response": res}
            except Exception as e:
                print(f"[EventBridge Put Event Notice]: {e}")

        # Local event bus execution trigger
        return {
            "status": "EMITTED_LOCAL",
            "event": event_type,
            "detail": detail,
            "next_step": (
                "Archive Brand Check" if event_type == "campaign.draft_created"
                else "Step Functions Video Pipeline" if event_type == "campaign.approved"
                else "Atlas 4-Phase Rollout"
            )
        }

event_bus = EventBridgeDispatcher()
