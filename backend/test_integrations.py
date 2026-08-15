import asyncio
import json
from agent_engine import PythonAgentEngine

def main():
    print("=== Testing Playwright Browser Control Agent ===")
    browser_res = PythonAgentEngine.run_agent("Scrape https://example.com for prospect links", agent_type="browser")
    print(json.dumps(browser_res, indent=2))

    print("\n=== Testing Twilio Phone Caller Agent ===")
    phone_res = PythonAgentEngine.run_agent("Call +14155552671 regarding enterprise SDR demo", agent_type="phone")
    print(json.dumps(phone_res, indent=2))

if __name__ == "__main__":
    main()
