import asyncio
import json
import time
import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agent_platform.orchestrator import Platform

async def main():
    p = Platform()
    agents = [
        ("Jordan (B2B Sales Agent)", p.sales, "Pitch CloudSuite workflow automation platform to an enterprise VP of Operations."),
        ("ObjectionHandler (Diplomat)", p.objection, "Buyer says: 'Your pricing is 30% higher than competitors and uptime SLA is only 99.9%'."),
        ("Archive (Brand Guardian)", p.brand, "Audit this tagline: 'Kaiso is cheap and easy for anyone to spam emails.'"),
        ("Atlas (PM Planner)", p.planner, "Create a 4-phase rollout plan for deploying 50 AI agent workers across an enterprise sales team."),
        ("Warden (Auditor/Conflict)", p.conflict, "Check for resource conflicts when 3 agents attempt simultaneous database writes."),
        ("Creator (Marketing Concept)", p.creator, "Generate 3 high-converting ad concepts for B2B SaaS founders.")
    ]

    print("==================================================")
    print("  KAISO AGENT OS — MULTI-AGENT VERIFICATION TEST  ")
    print("==================================================\n")

    for name, agent_inst, prompt in agents:
        t0 = time.time()
        print(f">>> TESTING AGENT: {name}")
        print(f"    PROMPT: '{prompt}'")
        try:
            res = await agent_inst.think(prompt)
            dt = time.time() - t0
            print(f"    STATUS: SUCCESS ({dt:.2f}s)")
            print(f"    RESPONSE Snippet:\n{res[:200]}...\n")
        except Exception as e:
            print(f"    STATUS: FAILED --> {e}\n")

if __name__ == "__main__":
    asyncio.run(main())
