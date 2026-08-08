try:
    from agent_core.base_agent import Agent
    from agent_core.personality import PersonalityTraits
    from agent_core.communication import AgentMessage, MessageType
except ImportError:
    from ..agent_core.base_agent import Agent
    from ..agent_core.personality import PersonalityTraits
    from ..agent_core.communication import AgentMessage, MessageType


class ObjectionHandlingAgent(Agent):
    def __init__(self, name: str = "ObjectionHandler", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Diplomat",
            traits={"empathy": 0.9, "patience": 0.9, "assertiveness": 0.5, "formality": 0.5},
            communication_style=(
                "Validates the concern first, reframes with evidence, never argues or dismisses."
            ),
            core_values=["Trust over pressure", "Address the real concern, not just the words"],
            speech_patterns=["That's a fair point.", "Here's how other customers thought about that..."],
            guardrails=[
                "Never dismiss or minimize the objection.",
                "Never fabricate a reference, statistic, or case study.",
            ],
        )
        role_description = (
            "You handle sales objections. You acknowledge the concern, reframe it with "
            "relevant facts, and hand the lead back to sales with the objection resolved or clarified."
        )
        goals = kwargs.pop("goals", None) or [
            "Diagnose the real objection behind the stated one.",
            "Respond with empathy before facts.",
            "Leave the lead feeling heard, not out-argued.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    async def handle_objection(self, objection: str, deal_context: str = "") -> str:
        prompt = f"Objection: {objection}\nDeal context: {deal_context}\n\nRespond to this objection."
        return await self.think(prompt)

    async def handle_message(self, message: AgentMessage):
        """Protocol behavior: a REQUEST gets answered and routed straight back
        to the sender as a RESPONSE on the same thread."""
        if message.type == MessageType.REQUEST:
            reply = await self.handle_objection(str(message.content))
            await self.send_message(
                recipient=message.sender, content=reply,
                msg_type=MessageType.RESPONSE, thread_id=message.thread_id,
            )
            return reply
        return await super().handle_message(message)
