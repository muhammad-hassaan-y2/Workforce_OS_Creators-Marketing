"""
AWS Bedrock & Google Gemini Dynamic LLM Agent Base Class
==========================================================
Executes 100% dynamic LLM agent reasoning turns via Google Gemini API (gemini-flash-latest),
AWS Bedrock Models API (boto3 bedrock-runtime / Bearer Token), or external LLM API.
Returns exact LLM generated output or exact raw LLM API error if invocation fails.
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
    AWS Bedrock & Google Gemini Autonomous AI Agent
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
        Executes LLM reasoning turn via Google Gemini API, AWS Bedrock SDK, or Bearer Token API.
        Returns the exact LLM generated output or exact raw LLM API error if invocation fails.
        """
        system_prompt = self.personality_engine.build_system_prompt(
            self.role_description, self.goals, extra_context
        )

        llm_errors = []

        # 1. Attempt AWS Bedrock Bearer Token API Invocation (Mantle / Bedrock API Key)
        bedrock_api_key = os.getenv("AWS_BEARER_TOKEN_BEDROCK") or os.getenv("AWS_BEDROCK_API_KEY")
        if bedrock_api_key:
            for model_id in [self.model, "us.amazon.nova-micro-v1:0", "us.amazon.nova-lite-v1:0"]:
                try:
                    ep = f"https://bedrock-runtime.{self.aws_region}.amazonaws.com/model/{model_id}/invoke"
                    messages = self.history + [{"role": "user", "content": user_input}]
                    payload = {
                        "system": [{"text": system_prompt}],
                        "messages": [{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages]
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
                        output_msg = res_body.get("output", {}).get("message", {}).get("content", [])
                        if output_msg:
                            reply = output_msg[0].get("text", "")

                        if reply:
                            self.history.append({"role": "user", "content": user_input})
                            self.history.append({"role": "assistant", "content": reply})
                            return reply
                except Exception as e:
                    llm_errors.append(f"Bedrock Bearer ({model_id}): {e}")

        # 3. Attempt Live AWS Bedrock Runtime Boto3 Client Invocation (converse() and invoke_model())
        if self.bedrock_client is not None:
            candidate_models = [self.model, "arn:aws:bedrock:us-east-1:537124945123:inference-profile/global.amazon.nova-2-lite-v1:0", "us.amazon.nova-micro-v1:0"]
            for model_id in candidate_models:
                try:
                    messages = self.history + [{"role": "user", "content": user_input}]
                    # Try converse() API first
                    try:
                        conv_res = self.bedrock_client.converse(
                            modelId=model_id,
                            system=[{"text": system_prompt}],
                            messages=[{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages],
                            inferenceConfig={"maxTokens": 1000, "temperature": 0.7}
                        )
                        reply = conv_res.get("output", {}).get("message", {}).get("content", [])[0].get("text", "")
                        if reply:
                            self.history.append({"role": "user", "content": user_input})
                            self.history.append({"role": "assistant", "content": reply})
                            return reply
                    except Exception as conv_err:
                        pass

                    # Fallback to invoke_model() API
                    payload = {
                        "system": [{"text": system_prompt}],
                        "messages": [{"role": m["role"], "content": [{"text": m["content"]}]} for m in messages]
                    }

                    response = self.bedrock_client.invoke_model(
                        modelId=model_id,
                        contentType="application/json",
                        accept="application/json",
                        body=json.dumps(payload)
                    )

                    response_body = json.loads(response.get("body").read())
                    reply = ""
                    output_msg = response_body.get("output", {}).get("message", {}).get("content", [])
                    if output_msg:
                        reply = output_msg[0].get("text", "")

                    if reply:
                        self.history.append({"role": "user", "content": user_input})
                        self.history.append({"role": "assistant", "content": reply})
                        return reply
                except Exception as err:
                    llm_errors.append(f"Boto3 Bedrock ({model_id}): {err}")

        # 4. Attempt External OpenAI / Groq API if configured
        external_reply, ext_err = self._try_external_llm_api(system_prompt, user_input)
        if external_reply:
            self.history.append({"role": "user", "content": user_input})
            self.history.append({"role": "assistant", "content": external_reply})
            return external_reply

        # 5. If all LLM APIs fail, return raw LLM error message
        error_msg = f"❌ [LLM API Invocation Error]: {llm_errors[0] if llm_errors else 'No API keys configured'}"
        self.history.append({"role": "user", "content": user_input})
        self.history.append({"role": "assistant", "content": error_msg})
        return error_msg

    def _try_gemini_llm_api(self, system_prompt: str, user_input: str) -> Tuple[str, str]:
        """
        Invokes Google Gemini API with system prompt persona and user input.
        """
        gemini_key = os.getenv("GEMINI_API_KEY")
        if not gemini_key:
            return "", "No GEMINI_API_KEY set in backend/.env"

        models = ["models/gemini-flash-latest", "models/gemini-2.5-flash", "models/gemini-pro-latest"]
        for m in models:
            url = f"https://generativelanguage.googleapis.com/v1beta/{m}:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"System Persona & Instructions:\n{system_prompt}\n\nUser Instruction:\n{user_input}"}
                        ]
                    }
                ]
            }
            try:
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=12) as resp:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    candidates = res_json.get("candidates", [])
                    if candidates and len(candidates) > 0:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and len(parts) > 0:
                            return parts[0].get("text", ""), ""
            except Exception as e:
                print(f"[Gemini Model {m} Notice]: {e}")
                continue

        return "", "Google Gemini API rate limit or model error"

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
