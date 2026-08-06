"""
Agent Creator = your "Agent Creating: Concept Generation" + "Agent Creating"
requirements in one class:
  - generate_concept(): asks Claude to design a new persona as structured JSON
  - create_agent(): instantiates (and optionally registers on the bus) a live
    Agent from that persona, ready to receive messages / be called directly.
"""
import json
from typing import Any, Dict, List, Optional

try:
    from agent_core.base_agent import Agent
    from agent_core.personality import PersonalityTraits
    from agent_core.communication import CommunicationBus
except ImportError:
    from ..agent_core.base_agent import Agent
    from ..agent_core.personality import PersonalityTraits
    from ..agent_core.communication import CommunicationBus


class AgentCreator(Agent):
    def __init__(self, name: str = "Forge", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Casting Director",
            traits={"creativity": 0.9, "structure": 0.8, "formality": 0.5},
            communication_style="Thinks in personas: motivation and voice before behavior.",
            core_values=["Every agent needs a clear, narrow job", "Personas should be distinct, not generic"],
            speech_patterns=["Here's who this agent needs to be...", "That role calls for a different voice."],
            guardrails=["Never generate a persona whose guardrails conflict with brand safety."],
        )
        role_description = (
            "You design new AI agent personas for a multi-agent business platform. "
            "Given a business need, you output a structured persona: archetype, "
            "personality traits, communication style, values, and guardrails."
        )
        goals = kwargs.pop("goals", None) or [
            "Produce personas distinct enough to be recognizable in a transcript.",
            "Always include concrete, situation-specific guardrails.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    async def generate_concept(self, brief: str) -> PersonalityTraits:
        """Concept Generation: ask Claude for a structured persona as JSON."""
        schema_hint = (
            "Respond with ONLY a JSON object with keys: "
            "name, archetype, traits (object of trait_name: float 0-1), "
            "communication_style, core_values (list of strings), "
            "speech_patterns (list of strings), backstory (string), "
            "guardrails (list of strings). No prose, no markdown fences."
        )
        prompt = f"Business need:\n{brief}\n\n{schema_hint}"
        raw = await self.think(prompt)
        data = self._safe_json(raw)
        return PersonalityTraits(**data)

    def _safe_json(self, raw: str) -> Dict[str, Any]:
        cleaned = raw.strip().strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Fallback so the pipeline still runs on malformed / mock output.
            return {
                "name": "Unnamed Agent",
                "archetype": "Generalist",
                "traits": {"formality": 0.5},
                "communication_style": "Neutral and helpful.",
                "core_values": [],
                "speech_patterns": [],
                "backstory": raw[:200],
                "guardrails": [],
            }

    def create_agent(
        self,
        concept: PersonalityTraits,
        role_description: str,
        goals: Optional[List[str]] = None,
        bus: Optional[CommunicationBus] = None,
        agent_cls=Agent,
    ) -> Agent:
        """Agent Creating: instantiate (and optionally register) a live agent."""
        new_agent = agent_cls(
            name=concept.name,
            role_description=role_description,
            personality=concept,
            goals=goals or [],
        )
        if bus is not None:
            bus.register(new_agent)
        return new_agent
