import os
import sys
import json
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

def test_database():
    print("=== 1. Testing Neon PostgreSQL Connection ===")
    try:
        from database import engine, Base
        import models
        models.Base.metadata.create_all(bind=engine)
        print("[SUCCESS] Connected to Neon PostgreSQL and initialized all database tables successfully!")
    except Exception as e:
        print(f"[ERROR] Neon DB Error: {e}")

def test_gemini():
    print("\n=== 2. Testing Google Gemini API Key ===")
    try:
        from agent_platform.agent_core.base_agent import Agent
        from agent_platform.agent_core.personality import PersonalityTraits
        
        personality = PersonalityTraits(
            name="TestAgent",
            archetype="Researcher",
            communication_style="Direct, empowered, and analytical."
        )
        agent = Agent(name="TestAgent", role_description="Tester", personality=personality)
        
        reply, err = agent._try_gemini_llm_api("You are a helpful assistant.", "Say hello from Kaiso Agent OS!")
        if reply:
            print(f"[SUCCESS] Live Gemini API Response: '{reply.strip()}'")
        else:
            print(f"[ERROR] Gemini Error: {err}")
    except Exception as e:
        print(f"[ERROR] Gemini Exception: {e}")

if __name__ == "__main__":
    test_database()
    test_gemini()
