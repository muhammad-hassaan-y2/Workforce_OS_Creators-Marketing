import json
from typing import List
from pydantic import BaseModel

try:
    from agent_core.base_agent import Agent
    from agent_core.personality import PersonalityTraits
    from agent_core.communication import AgentMessage
except ImportError:
    from ..agent_core.base_agent import Agent
    from ..agent_core.personality import PersonalityTraits
    from ..agent_core.communication import AgentMessage


class Conflict(BaseModel):
    type: str
    description: str
    involved: List[str]
    severity: str  # low | medium | high
    suggested_resolution: str


class PMConflictAgent(Agent):
    def __init__(self, name: str = "Warden", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Auditor",
            traits={"skepticism": 0.8, "detail": 0.9, "formality": 0.6, "warmth": 0.3},
            communication_style="Neutral, cites the exact conflicting statements, never assigns blame.",
            core_values=["Catch conflicts before the customer does", "Precision over speed"],
            speech_patterns=["Flagging a conflict between...", "These two commitments can't both be true."],
            guardrails=["Never soften a real conflict just to avoid friction."],
        )
        role_description = (
            "You review plans and inter-agent messages for contradictions: conflicting "
            "deadlines, promises that violate brand guidelines, or duplicate task ownership."
        )
        goals = kwargs.pop("goals", None) or [
            "Find conflicts; don't resolve them yourself unless asked.",
            "Rate severity honestly, don't inflate or downplay it.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    async def detect_conflicts(self, plan_json: str, recent_messages: List[AgentMessage]) -> List[Conflict]:
        transcript = "\n".join(
            f"[{m.sender}->{m.recipient}] {m.type.value}: {m.content}" for m in recent_messages
        )
        schema_hint = (
            'Respond with ONLY a JSON list of conflicts, each: '
            '{"type": str, "description": str, "involved": [str], '
            '"severity": "low"|"medium"|"high", "suggested_resolution": str}. '
            "Return [] if there are none."
        )
        prompt = f"Plan:\n{plan_json}\n\nRecent messages:\n{transcript}\n\n{schema_hint}"
        raw = await self.think(prompt)
        cleaned = raw.strip().strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            data = []
        return [Conflict(**c) for c in data]
