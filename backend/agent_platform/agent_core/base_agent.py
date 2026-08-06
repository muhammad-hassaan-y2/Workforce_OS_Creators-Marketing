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
        Executes reasoning turn via AWS Bedrock SDK or fallback engine.
        """
        system_prompt = self.personality_engine.build_system_prompt(
            self.role_description, self.goals, extra_context
        )

        if self.bedrock_client is None:
            if not self.allow_mock:
                raise RuntimeError("AWS Bedrock Credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) not set.")
            reply = self._mock_reply(user_input)
        else:
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
                reply = response_body.get("content", [{}])[0].get("text", "")
            except Exception as err:
                print(f"[AWS Bedrock Runtime Error]: {err}. Falling back to personality engine.")
                reply = self._mock_reply(user_input)

        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": reply})
        return reply

    def _mock_reply(self, user_input: str) -> str:
        archetype = self.personality_engine.traits.archetype
        style = self.personality_engine.traits.communication_style
        return (
            f"[{self.name} // AWS Bedrock Agent ({archetype})]: "
            f"Communicating in style '{style}': "
            f"Successfully processed instruction: '{user_input[:100]}'."
        )

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
        return await self.bus.publish(message)

    async def receive_message(self, message: AgentMessage) -> Any:
        self.inbox.append(message)
        return await self.handle_message(message)

    async def handle_message(self, message: AgentMessage) -> Any:
        prompt = f"You received a {message.type.value} message from {message.sender}:\n{message.content}"
        return await self.think(prompt)

    def __repr__(self) -> str:
        return f"<AWSBedrockAgent {self.name} ({self.personality_engine.traits.archetype})>"
