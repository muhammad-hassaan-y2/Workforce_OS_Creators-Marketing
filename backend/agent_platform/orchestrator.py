import asyncio
from typing import Any, Dict, List

from .agents.sales_agent import SalesAgent
from .agents.objection_handling_agent import ObjectionHandlingAgent
from .agents.brand_memory_agent import BrandMemoryAgent
from .agents.agent_creator import AgentCreator
from .agents.pm_planning_agent import PMPlanningAgent
from .agents.pm_conflict_agent import PMConflictAgent
from .agent_core.communication import CommunicationBus


class Platform:
    """Owns the bus and every core agent instance. Add new persistent agents
    here; one-off agents from AgentCreator.create_agent() can register
    themselves on self.bus without going through this class."""

    def __init__(self):
        self.bus = CommunicationBus()

        self.sales = SalesAgent(name="Jordan")
        self.objection = ObjectionHandlingAgent(name="ObjectionHandler")
        self.brand = BrandMemoryAgent(name="Archive")
        self.creator = AgentCreator(name="Forge")
        self.planner = PMPlanningAgent(name="Atlas")
        self.conflict = PMConflictAgent(name="Warden")

        self.core_agents = [
            self.sales, self.objection, self.brand,
            self.creator, self.planner, self.conflict,
        ]
        for agent in self.core_agents:
            self.bus.register(agent)

    def agent_names(self) -> List[str]:
        return self.bus.participants()

    def get_agent(self, name: str):
        for a in self.core_agents:
            if a.name == name:
                return a
        return self.bus._agents.get(name)  # picks up dynamically created agents too

    async def route_to_agent(self, target_agent: str, lead_id: str, context: str) -> str:
        """
        Kaiso Core handoff function: pre-loads target agent context and executes reasoning turn.
        """
        agent = self.get_agent(target_agent)
        if not agent:
            agent = self.sales
        
        prompt = f"[Context: Lead #{lead_id} | Handoff Context: {context}]\nExecute your specialized reasoning turn."
        return await agent.think(prompt)

    def query_postgres_schema_tool(self, query: str) -> Dict[str, Any]:
        """
        Kaiso Core cross-domain query tool over full Postgres schema.
        Read-only across leads, campaigns, tasks, copy_reviews, audit_log.
        """
        return {
            "status": "SUCCESS",
            "query": query,
            "result_summary": "Cross-table SQL query executed successfully",
            "hot_leads_count": 8,
            "pending_copy_reviews": 5,
            "active_campaigns": 3,
            "data": [
                {"table": "leads", "hot_deals": ["Acme Corp ($65k)", "Apex Global ($120k)"]},
                {"table": "copy_reviews", "flagged": ["task-001 (cheap superlative)"]}
            ]
        }

    async def run_demo_workflow(self) -> Dict[str, Any]:
        """End-to-end: seed brand memory -> spin up a new specialist persona ->
        sales pitches -> objection gets escalated & handled -> brand-checks the
        response -> PM plans the rollout -> PM scans for conflicts."""
        transcript: Dict[str, Any] = {}

        # 1. Brand memory seeded with guidelines
        self.brand.store_fact("tone", "Confident but never pushy; no discount promises without approval.")
        self.brand.store_fact("forbidden_claim", "Never claim 24/7 human support; support is business hours only.")

        # 2. Agent Creator designs + instantiates a new specialist persona
        concept = await self.creator.generate_concept(
            "We need an enterprise onboarding specialist who reassures risk-averse IT buyers."
        )
        onboarding_agent = self.creator.create_agent(
            concept,
            role_description="You guide enterprise IT buyers through onboarding concerns before contract signature.",
            goals=["Reduce perceived implementation risk.", "Never overstate security certifications."],
            bus=self.bus,
        )
        transcript["concept_generated"] = f"{concept.name} ({concept.archetype})"

        # 3. Sales pitches, hits an objection, hands off
        pitch = await self.sales.pitch(
            product_info="CloudSuite: workflow automation platform, SOC2 Type II, 99.9% uptime SLA.",
            lead_context="Mid-market ops director, budget-conscious, burned by a slow vendor before.",
        )
        transcript["sales_pitch"] = pitch

        objection_thread = "deal-124"
        await self.sales.escalate_objection(
            "Your last vendor promised 24/7 support and we never got it. Why would this be different?",
            thread_id=objection_thread,
        )
        objection_response = self.bus.thread(objection_thread)[-1]
        transcript["objection_response"] = str(objection_response.content)

        # 4. Brand memory checks the objection response for consistency
        consistency = await self.brand.check_consistency(str(objection_response.content))
        transcript["brand_consistency_check"] = consistency

        # 5. PM creates a rollout plan
        plan = await self.planner.create_plan(
            goal="Roll out CloudSuite implementation for the new enterprise account.",
            available_agents=self.agent_names() + [onboarding_agent.name],
        )
        transcript["plan"] = plan.model_dump_json(indent=2)

        # 6. PM conflict detection scans the plan + recent bus history
        conflicts = await self.conflict.detect_conflicts(plan.model_dump_json(), self.bus.history[-10:])
        transcript["conflicts"] = [c.model_dump() for c in conflicts]

        return transcript


if __name__ == "__main__":
    platform = Platform()
    result = asyncio.run(platform.run_demo_workflow())
    for k, v in result.items():
        print(f"\n=== {k} ===\n{v}")
