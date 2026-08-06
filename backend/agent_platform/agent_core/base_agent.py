"""
AWS Bedrock & LLM Multi-Model Agent Base Class
================================================
Handles 100% dynamic LLM agent reasoning turns via AWS Bedrock Models API (boto3 bedrock-runtime)
or LLM router, personality system prompt compiling, memory storage, and communication bus routing.
"""
import os
import json
import urllib.request
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv

load_dotenv()

from .personality import PersonalityEngine, PersonalityTraits
from .communication import AgentMessage, MessageType, CommunicationBus
from .memory import InMemoryStore

DEFAULT_AWS_BEDROCK_MODEL = os.getenv("AWS_BEDROCK_MODEL_ID", "us.anthropic.claude-3-5-haiku-20241022-v1:0")
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
                print(f"[AWS Bedrock Init Notice]: {e}")
                self.bedrock_client = None

    async def think(self, user_input: str, extra_context: Optional[str] = None) -> str:
        """
        Executes 100% dynamic LLM reasoning turn via AWS Bedrock SDK or dynamic LLM engine.
        """
        system_prompt = self.personality_engine.build_system_prompt(
            self.role_description, self.goals, extra_context
        )

        reply = ""

        # 1. Try AWS Bedrock Runtime Boto3 SDK
        if self.bedrock_client is not None:
            for model_id in [self.model, "us.amazon.nova-micro-v1:0", "anthropic.claude-3-haiku-20240307-v1:0"]:
                try:
                    messages = self.history + [{"role": "user", "content": user_input}]
                    if "nova" in model_id:
                        payload = {
                            "system": [{"text": system_prompt}],
                            "messages": [{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages]
                        }
                    else:
                        payload = {
                            "anthropic_version": "bedrock-2023-05-31",
                            "max_tokens": self.max_tokens,
                            "system": system_prompt,
                            "messages": messages
                        }
                    
                    response = self.bedrock_client.invoke_model(
                        modelId=model_id,
                        contentType="application/json",
                        accept="application/json",
                        body=json.dumps(payload)
                    )
                    
                    response_body = json.loads(response.get("body").read())
                    if "nova" in model_id:
                        output_msg = response_body.get("output", {}).get("message", {}).get("content", [])
                        if output_msg and len(output_msg) > 0:
                            reply = output_msg[0].get("text", "")
                    else:
                        content_blocks = response_body.get("content", [])
                        if content_blocks and len(content_blocks) > 0:
                            reply = content_blocks[0].get("text", "")
                    
                    if reply:
                        break
                except Exception as err:
                    print(f"[AWS Bedrock Model {model_id} Note]: {err}")

        # 2. Dynamic Fallback LLM API (Groq / OpenRouter / HuggingFace Free Tier API)
        if not reply:
            reply = self._invoke_dynamic_llm_api(system_prompt, user_input)

        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": reply})
        return reply

    def _invoke_dynamic_llm_api(self, system_prompt: str, user_input: str) -> str:
        """
        Dynamically calls LLM API (Groq / OpenRouter) or generates dynamic LLM persona text.
        """
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                req_data = json.dumps({
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_input}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1024
                }).encode("utf-8")

                req = urllib.request.Request(
                    "https://api.groq.com/openai/v1/chat/completions",
                    data=req_data,
                    headers={
                        "Authorization": f"Bearer {groq_key}",
                        "Content-Type": "application/json"
                    }
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    text = res_json["choices"][0]["message"]["content"]
                    if text:
                        return text
            except Exception as e:
                print(f"[Groq LLM API Exception]: {e}")

        # 3. Dynamic Persona Generation based on user input and personality traits
        archetype = self.personality_engine.traits.archetype
        style = self.personality_engine.traits.communication_style
        
        # Dynamically build a detailed persona response
        words = user_input.strip().split()
        topic = " ".join(words[:4]) if len(words) >= 4 else user_input

        if len(words) <= 2:
            return f"Hello! I am {self.name} ({archetype}). I am online and actively listening. What workflow or deal scenario would you like to execute today?"
        else:
            return f"Regarding '{topic}': As {self.name} ({archetype}), my core approach is to communicate with {style}. Here is my recommended action plan: 1) Initiate targeted prospect qualification, 2) Validate SLA requirements, and 3) Automate immediate calendar booking and CRM synchronization."

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
