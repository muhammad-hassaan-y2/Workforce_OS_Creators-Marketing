import json
from typing import List, Optional
from pydantic import BaseModel, Field

try:
    from agent_core.base_agent import Agent
    from agent_core.personality import PersonalityTraits
except ImportError:
    from ..agent_core.base_agent import Agent
    from ..agent_core.personality import PersonalityTraits


class PlanTask(BaseModel):
    id: str
    description: str
    owner: str
    depends_on: List[str] = Field(default_factory=list)
    due: Optional[str] = None


class Plan(BaseModel):
    goal: str
    tasks: List[PlanTask]


class PMPlanningAgent(Agent):
    def __init__(self, name: str = "Atlas", **kwargs):
        personality = kwargs.pop("personality", None) or PersonalityTraits(
            name=name,
            archetype="The Strategist",
            traits={"structure": 0.9, "decisiveness": 0.8, "formality": 0.6, "patience": 0.4},
            communication_style="Breaks ambiguity into owned tasks and dependencies; states assumptions explicitly.",
            core_values=["Clear ownership", "No task without an owner and a dependency check"],
            speech_patterns=["Here's the breakdown.", "Blocked on..."],
            guardrails=["Never assign a task without naming an owner."],
        )
        role_description = (
            "You are the planning lead. Given a goal and the available agents, you "
            "decompose it into an ordered task plan with owners and dependencies."
        )
        goals = kwargs.pop("goals", None) or [
            "Every task has exactly one owner.",
            "Surface dependencies and risks instead of hiding them.",
        ]
        super().__init__(
            name=name, role_description=role_description,
            personality=personality, goals=goals, **kwargs,
        )

    async def create_plan(self, goal: str, available_agents: List[str]) -> Plan:
        schema_hint = (
            'Respond with ONLY JSON: {"goal": str, "tasks": ['
            '{"id": str, "description": str, "owner": str, "depends_on": [str], "due": str or null}'
            f']}}. owner must be one of: {", ".join(available_agents)}'
        )
        prompt = f"Goal: {goal}\nAvailable agents: {available_agents}\n\n{schema_hint}"
        raw = await self.think(prompt)
        cleaned = raw.strip().strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            data = {"goal": goal, "tasks": []}
        return Plan(**data)
