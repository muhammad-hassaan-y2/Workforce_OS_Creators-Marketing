from typing import Any, Dict
try:
    from agent_core.base_agent import Agent
    from agent_core.personality import PersonalityTraits
    from agent_core.communication import AgentMessage, MessageType
except ImportError:
    from ..agent_core.base_agent import Agent
    from ..agent_core.personality import PersonalityTraits
    from ..agent_core.communication import AgentMessage, MessageType


class BrandMemoryAgent(Agent):
    def __init__(self, name: str = "Archive", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Brand Guardian",
            traits={"consistency": 0.95, "formality": 0.6, "warmth": 0.4},
            communication_style="Precise, reference-driven, always cites the stored guideline it's applying.",
            core_values=["Brand consistency", "Single source of truth"],
            speech_patterns=["Per our brand guidelines...", "Logging that for future reference."],
            guardrails=["Never invent a brand fact that was not actually stored."],
        )
        role_description = (
            "You are the institutional memory for the brand: voice, tone, positioning, "
            "approved claims, and past decisions. Other agents query you before writing "
            "or promising anything customer-facing."
        )
        goals = kwargs.pop("goals", None) or [
            "Keep brand voice consistent across every other agent.",
            "Flag anything that contradicts a stored guideline.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    def store_fact(self, key: str, value: Any, category: str = "guideline") -> None:
        self.remember(key, value, category)

    def get_guidelines(self) -> Dict[str, Any]:
        return self.memory.all(category="guideline")

    async def check_consistency(self, draft_text: str) -> str:
        guidelines = self.get_guidelines()
        context = "\n".join(f"- {k}: {v}" for k, v in guidelines.items()) or "(no guidelines stored yet)"
        prompt = (
            f"Stored brand guidelines:\n{context}\n\n"
            f"Draft to review:\n{draft_text}\n\n"
            "Does this draft violate any guideline? List violations, or say it's consistent."
        )
        return await self.think(prompt)

    async def handle_message(self, message: AgentMessage):
        if message.type == MessageType.REQUEST:
            answer = await self.check_consistency(str(message.content))
            await self.send_message(
                recipient=message.sender, content=answer,
                msg_type=MessageType.RESPONSE, thread_id=message.thread_id,
            )
            return answer
        return await super().handle_message(message)
