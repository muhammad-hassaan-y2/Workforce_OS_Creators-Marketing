"""
Run with:  python test_agents.py

Works with or without ANTHROPIC_API_KEY set — falls back to labeled mock
replies if it's missing, so you can validate the wiring for free first.
"""
import asyncio
from orchestrator import Platform


async def test_individual_agents(p: Platform):
    print("\n----- Sales Agent -----")
    print(await p.sales.pitch(
        product_info="CloudSuite: workflow automation, SOC2 Type II.",
        lead_context="Mid-market ops director evaluating vendors.",
    ))

    print("\n----- Objection Handling Agent -----")
    print(await p.objection.handle_objection("This feels expensive compared to what we use now."))

    print("\n----- Brand Memory Agent -----")
    p.brand.store_fact("tagline", "Automation that gets out of your way.")
    print(await p.brand.check_consistency("Our new AI will replace your entire ops team overnight!"))

    print("\n----- Agent Creator: Concept Generation -----")
    concept = await p.creator.generate_concept(
        "An agent that negotiates renewal pricing with churn-risk accounts."
    )
    print(f"Generated persona: {concept.name} - {concept.archetype}")
    print(f"Traits: {concept.traits}")

    print("\n----- Agent Creator: Agent Creating (instantiation) -----")
    new_agent = p.creator.create_agent(
        concept,
        role_description="You negotiate renewal terms with accounts flagged as churn risks.",
        bus=p.bus,
    )
    print(f"Instantiated live agent: {new_agent}")
    print(await new_agent.think("The customer says they're evaluating a competitor. Open the conversation."))

    print("\n----- PM Planning Agent -----")
    plan = await p.planner.create_plan(
        goal="Launch the renewal-risk outreach program.",
        available_agents=p.agent_names(),
    )
    print(plan.model_dump_json(indent=2))

    print("\n----- PM Conflict Detection Agent -----")
    conflicts = await p.conflict.detect_conflicts(plan.model_dump_json(), p.bus.history[-5:])
    print([c.model_dump() for c in conflicts] or "No conflicts detected.")


async def test_communication_protocol(p: Platform):
    print("\n----- Inter-Agent Communication Protocol -----")
    thread_id = "test-thread-1"
    await p.sales.escalate_objection("They think our onboarding takes too long.", thread_id=thread_id)
    for m in p.bus.thread(thread_id):
        print(f"[{m.type.value}] {m.sender} -> {m.recipient}: {str(m.content)[:150]}")


async def test_full_workflow(p: Platform):
    print("\n----- Full Demo Workflow -----")
    result = await p.run_demo_workflow()
    for k, v in result.items():
        print(f"\n=== {k} ===\n{v}")


async def main():
    p = Platform()
    await test_individual_agents(p)
    await test_communication_protocol(p)
    await test_full_workflow(p)


if __name__ == "__main__":
    asyncio.run(main())
