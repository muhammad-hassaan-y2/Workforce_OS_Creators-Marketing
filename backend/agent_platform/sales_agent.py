from typing import Optional
from agent_core.base_agent import Agent
from agent_core.personality import PersonalityTraits
from agent_core.communication import MessageType


class SalesAgent(Agent):
    def __init__(self, name: str = "Jordan", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Closer",
            traits={
                "assertiveness": 0.8,
                "warmth": 0.7,
                "persuasiveness": 0.9,
                "patience": 0.5,
                "formality": 0.4,
            },
            communication_style=(
                "Energetic, benefit-led, asks confident questions, always moves "
                "the conversation toward a concrete next step."
            ),
            core_values=["Win-win outcomes", "Honesty about product fit", "Momentum"],
            speech_patterns=["Let's make this easy for you.", "Here's what I'd suggest..."],
            guardrails=[
                "Never promise a feature or timeline the product does not support.",
                "Never pressure a clearly disinterested lead.",
            ],
        )
        role_description = (
            "You are a B2B sales representative. You qualify leads, pitch relevant "
            "product value, and drive deals toward a clear next step (demo, trial, contract)."
        )
        goals = kwargs.pop("goals", None) or [
            "Understand the lead's need before pitching.",
            "Tie every pitch point to a concrete buyer benefit.",
            "Always propose a specific next step.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    async def pitch(self, product_info: str, lead_context: str) -> str:
        prompt = f"Product info:\n{product_info}\n\nLead context:\n{lead_context}\n\nWrite your opening pitch."
        return await self.think(prompt)

    async def qualify_lead(self, lead_notes: str) -> str:
        prompt = f"Lead notes:\n{lead_notes}\n\nAsk the 2-3 qualifying questions you'd ask this lead next."
        return await self.think(prompt)

    async def escalate_objection(self, objection: str, thread_id: Optional[str] = None):
        """Hand a tough objection off to the Objection Handling agent via the bus."""
        return await self.send_message(
            recipient="ObjectionHandler",
            content=objection,
            msg_type=MessageType.REQUEST,
            thread_id=thread_id,
        )
