import json
from agent_engine import PythonAgentEngine

def main():
    print("=== Testing Upgraded Autonomous Web Research & Scraper ===")
    res = PythonAgentEngine.run_agent("Research top AI agents trends on https://example.com", agent_type="browser")
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    main()
