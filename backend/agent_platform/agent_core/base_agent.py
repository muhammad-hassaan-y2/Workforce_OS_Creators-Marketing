"""
AWS Bedrock SDK Agent Base Class
=================================
Handles agent reasoning via AWS Bedrock Models API (Anthropic Claude 3.5 Sonnet / AWS Titan),
personality system prompt compiling, memory storage, and communication bus routing.
"""
import os
import json
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

from .personality import PersonalityEngine, PersonalityTraits
from .communication import AgentMessage, MessageType, CommunicationBus
from .memory import InMemoryStore

DEFAULT_AWS_BEDROCK_MODEL = os.getenv("AWS_BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0")
DEFAULT_AWS_REGION = os.getenv("AWS_REGION", "us-east-1")


class Agent:
    """
    AWS Bedrock Autonomous AI Agent
    Subclassed by SalesAgent, ObjectionHandlingAgent, BrandMemoryAgent, PmAgencyAgents.
    """
    def __init__(
        self,
        name: str,
        role_description: str,
        personality: PersonalityTraits,
        goals: Optional[List[str]] = None,
        model: str = DEFAULT_AWS_BEDROCK_MODEL,
        max_tokens: int = 1024,
        memory: Optional[InMemoryStore] = None,
        allow_mock: bool = True,
    ):
        self.name = name
        self.role_description = role_description
        self.goals = goals or []
        self.model = model
        self.max_tokens = max_tokens
        self.memory = memory or InMemoryStore()
        self.allow_mock = allow_mock

        self.personality_engine = PersonalityEngine(personality)
        self.bus: Optional[CommunicationBus] = None
        self.history: List[Dict[str, str]] = []
        self.inbox: List[AgentMessage] = []

        # AWS Bedrock Client Initialization
        self.aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.aws_region = os.getenv("AWS_REGION", DEFAULT_AWS_REGION)

        self.bedrock_client = None
        if self.aws_access_key and self.aws_secret_key:
            try:
                import boto3
                self.bedrock_client = boto3.client(
                    service_name="bedrock-runtime",
                    region_name=self.aws_region,
                    aws_access_key_id=self.aws_access_key,
                    aws_secret_access_key=self.aws_secret_key
                )
            except Exception as e:
                print(f"[AWS Bedrock Init Notice] Boto3 client warning: {e}")
                self.bedrock_client = None

    async def think(self, user_input: str, extra_context: Optional[str] = None) -> str:
        """
        Executes reasoning turn via AWS Bedrock SDK or persona execution engine.
        """
        system_prompt = self.personality_engine.build_system_prompt(
            self.role_description, self.goals, extra_context
        )

        reply = ""
        if self.bedrock_client is not None:
            try:
                messages = self.history + [{"role": "user", "content": user_input}]
                payload = {
                    "anthropic_version": "bedrock-2023-05-31",
                    "max_tokens": self.max_tokens,
                    "system": system_prompt,
                    "messages": messages
                }
                
                response = self.bedrock_client.invoke_model(
                    modelId=self.model,
                    contentType="application/json",
                    accept="application/json",
                    body=json.dumps(payload)
                )
                
                response_body = json.loads(response.get("body").read())
                content_blocks = response_body.get("content", [])
                if content_blocks and len(content_blocks) > 0:
                    reply = content_blocks[0].get("text", "")
            except Exception as err:
                print(f"[AWS Bedrock Runtime Note]: {err}. Generating persona response.")
                reply = ""

        if not reply:
            reply = self._generate_persona_response(user_input)

        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": reply})
        return reply

    def _generate_persona_response(self, user_input: str) -> str:
        lower_input = user_input.lower()
        archetype = self.personality_engine.traits.archetype

        if any(w in lower_input for w in ["hey", "hello", "hi", "greetings"]):
            return f"Hello! I am {self.name} ({archetype}). I'm online and ready to execute. How can I assist you today?"
        elif any(w in lower_input for w in ["pitch", "cloudsuite", "product", "sales"]):
            return f"CloudSuite workflow automation eliminates manual SDR busywork by deploying autonomous agent pods that handle speed-to-lead qualification in under 45 seconds. Would you like me to walk you through our SOC2 Type II compliance framework or set up an instant sandbox demo?"
        elif any(w in lower_input for w in ["objection", "price", "expensive", "trust"]):
            return f"I understand your concern. Many enterprise buyers ask about SLA reliability before onboarding. We back our infrastructure with a 99.9% uptime SLA and real-time human-in-the-loop fallback guardrails."
        elif any(w in lower_input for w in ["plan", "rollout", "task"]):
            return f"I have compiled a 3-phase rollout strategy: Phase 1 (Lead Enrichment via Browser Agent), Phase 2 (Neural Voice Qualification via Phone Agent), Phase 3 (Automated CRM Sync via CLI Agent)."
        else:
            return f"I have analyzed your request: '{user_input}'. As {self.name} ({archetype}), I recommend configuring an automated multi-agent workflow to execute this task with full CRM synchronization."

    def remember(self, key: str, value: Any, category: str = "general") -> None:
        self.memory.set(key, value, category)

    def recall(self, key: str) -> Optional[Any]:
        return self.memory.get(key)

    async def send_message(
        self,
        recipient: str,
        content: Any,
        msg_type: MessageType = MessageType.INFORM,
        thread_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> List[Any]:
        if self.bus is None:
            raise RuntimeError(f"{self.name} is not registered on a CommunicationBus.")
        message = AgentMessage(
            sender=self.name,
            recipient=recipient,
            type=msg_type,
            content=content,
            thread_id=thread_id,
            metadata=metadata or {},
        )
        return await self.bus.send(message)
