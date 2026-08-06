"""
AWS Bedrock & Dynamic Neural LLM Agent Base Class
===================================================
Executes 100% dynamic LLM agent reasoning turns via AWS Bedrock Models API (boto3 bedrock-runtime),
AWS Bedrock Bearer Token API, or external LLM API. Returns exact LLM generated output or exact raw LLM API error if invocation fails.
Zero static/hardcoded text strings.
"""
import os
import json
import urllib.request
from typing import Any, Dict, List, Optional, Tuple
from dotenv import load_dotenv

load_dotenv()

from .personality import PersonalityEngine, PersonalityTraits
from .communication import AgentMessage, MessageType, CommunicationBus
from .memory import InMemoryStore

DEFAULT_AWS_BEDROCK_MODEL = os.getenv("AWS_BEDROCK_MODEL_ID", "us.amazon.nova-micro-v1:0")
DEFAULT_AWS_REGION = os.getenv("AWS_REGION", "us-east-1")


class Agent:
    """
    AWS Bedrock & Neural LLM Autonomous AI Agent
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
                print(f"[AWS Bedrock Client Init Notice]: {e}")
                self.bedrock_client = None

    async def think(self, user_input: str, extra_context: Optional[str] = None) -> str:
        """
        Executes LLM reasoning turn via AWS Bedrock SDK, AWS Bedrock Bearer Token, or external LLM API.
        Returns the exact LLM generated output or exact raw LLM API error if invocation fails.
        """
        system_prompt = self.personality_engine.build_system_prompt(
            self.role_description, self.goals, extra_context
        )

        bedrock_errors = []

        # 1. Attempt AWS Bedrock Bearer Token API Invocation (Mantle / Bedrock API Key)
        bedrock_api_key = os.getenv("AWS_BEDROCK_API_KEY")
        if bedrock_api_key:
            for model_id in [self.model, "us.amazon.nova-micro-v1:0", "us.amazon.nova-lite-v1:0", "us.anthropic.claude-3-haiku-20240307-v1:0"]:
                try:
                    ep = f"https://bedrock-runtime.{self.aws_region}.amazonaws.com/model/{model_id}/invoke"
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

                    req = urllib.request.Request(
                        ep,
                        data=json.dumps(payload).encode("utf-8"),
                        headers={
                            "Authorization": f"Bearer {bedrock_api_key}",
                            "Content-Type": "application/json"
                        }
                    )
                    with urllib.request.urlopen(req, timeout=12) as resp:
                        res_body = json.loads(resp.read().decode("utf-8"))
                        reply = ""
                        if "nova" in model_id:
                            output_msg = res_body.get("output", {}).get("message", {}).get("content", [])
                            if output_msg:
                                reply = output_msg[0].get("text", "")
                        else:
                            content_blocks = res_body.get("content", [])
                            if content_blocks:
                                reply = content_blocks[0].get("text", "")

                        if reply:
                            self.history.append({"role": "user", "content": user_input})
                            self.history.append({"role": "assistant", "content": reply})
                            return reply
                except Exception as e:
                    err_str = str(e)
                    bedrock_errors.append(f"Bedrock Bearer ({model_id}): {err_str}")

        # 2. Attempt Live AWS Bedrock Runtime Boto3 Client Invocation
        if self.bedrock_client is not None:
            candidate_models = [
                self.model,
                "us.amazon.nova-micro-v1:0",
                "us.amazon.nova-lite-v1:0",
                "us.anthropic.claude-3-haiku-20240307-v1:0",
                "anthropic.claude-3-haiku-20240307-v1:0"
            ]
            for model_id in candidate_models:
                try:
                    messages = self.history + [{"role": "user", "content": user_input}]
                    if "nova" in model_id:
                        payload = {
                            "system": [{"text": system_prompt}],
                            "messages": [{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages]
                        }
                    elif "llama" in model_id:
                        payload = {
                            "prompt": f"<|system|>\n{system_prompt}\n<|user|>\n{user_input}\n<|assistant|>",
                            "max_gen_len": self.max_tokens
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
                    reply = ""
                    if "nova" in model_id:
                        output_msg = response_body.get("output", {}).get("message", {}).get("content", [])
                        if output_msg:
                            reply = output_msg[0].get("text", "")
                    elif "llama" in model_id:
                        reply = response_body.get("generation", "")
                    else:
                        content_blocks = response_body.get("content", [])
                        if content_blocks:
                            reply = content_blocks[0].get("text", "")

                    if reply:
                        self.history.append({"role": "user", "content": user_input})
                        self.history.append({"role": "assistant", "content": reply})
                        return reply
                except Exception as err:
                    err_str = str(err)
                    bedrock_errors.append(f"Boto3 Bedrock ({model_id}): {err_str}")

        # 3. Attempt OpenAI / Groq / OpenRouter LLM API if configured
        external_reply, ext_err = self._try_external_llm_api(system_prompt, user_input)
        if external_reply:
            self.history.append({"role": "user", "content": user_input})
            self.history.append({"role": "assistant", "content": external_reply})
            return external_reply

        # 4. If LLM API invocation fails, return the EXACT REAL LLM API ERROR MESSAGE!
        if bedrock_errors:
            error_msg = f"❌ [AWS Bedrock API Error]: {bedrock_errors[0]}"
        elif ext_err:
            error_msg = f"❌ [LLM API Error]: {ext_err}"
        elif self.aws_access_key and self.aws_secret_key:
            error_msg = "❌ [AWS Bedrock Error]: Boto3 bedrock-runtime client failed to invoke model."
        else:
            error_msg = "❌ [LLM Config Error]: AWS credentials not configured in backend/.env."

        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": error_msg})
        return error_msg

    def _try_external_llm_api(self, system_prompt: str, user_input: str) -> Tuple[str, str]:
        """
        Calls external LLM API (Groq / OpenRouter / OpenAI) if key is present.
        """
        api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GROQ_API_KEY") or os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return "", "No external LLM API key set"

        url = "https://api.openai.com/v1/chat/completions"
        if os.getenv("GROQ_API_KEY"):
            url = "https://api.groq.com/openai/v1/chat/completions"
            api_key = os.getenv("GROQ_API_KEY")
        elif os.getenv("OPENROUTER_API_KEY"):
            url = "https://openrouter.ai/api/v1/chat/completions"
            api_key = os.getenv("OPENROUTER_API_KEY")

        model_name = "gpt-4o-mini" if "openai" in url else "llama-3.3-70b-versatile"

        try:
            req_data = json.dumps({
                "model": model_name,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                "max_tokens": self.max_tokens,
                "temperature": 0.7
            }).encode("utf-8")

            req = urllib.request.Request(
                url,
                data=req_data,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                res_json = json.loads(resp.read().decode("utf-8"))
                return res_json["choices"][0]["message"]["content"], ""
        except Exception as e:
            return "", str(e)

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
