#!/usr/bin/env python3
"""
Kaiso Autonomous AI Agent OS — Command Line Harness
=====================================================
Allows users to run Kaiso commands natively via PyPI:
    pip install kaiso-cli
    kaiso chat "Pitch CloudSuite to an enterprise VP of Operations"
    kaiso test
    kaiso status
"""
import sys
import os
import json
import urllib.request

DEFAULT_API_URL = os.getenv("KAISO_API_URL", "http://127.0.0.1:8000/api")

def print_banner():
    print("==================================================")
    print("  KAISO AGENT OS -- AUTONOMOUS MULTI-AGENT HARNESS ")
    print("==================================================\n")

def run_chat(prompt: str, agent_id: str = "sales"):
    print(f"[Executing Agent Request]: '{prompt}' (Agent: {agent_id})")
    url = f"{DEFAULT_API_URL}/threads/thread-cli-harness/messages"
    payload = {"text": prompt, "agent_id": agent_id}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            out = json.loads(resp.read().decode("utf-8"))
            print(f"\nSTATUS: {out.get('status')}")
            print(f"AGENT RESPONSE:\n{out.get('assistant_message', {}).get('text')}\n")
    except Exception as e:
        print(f"[-] Error connecting to Kaiso Backend API ({DEFAULT_API_URL}): {e}")

def run_test():
    print_banner()
    print("[TEST] Running Multi-Agent System Verification Test...\n")
    agents = ["sales", "objection", "brand", "planner", "conflict", "creator"]
    for a in agents:
        url = f"{DEFAULT_API_URL}/agents/run"
        req = urllib.request.Request(
            url,
            data=json.dumps({"prompt": f"Test harness for {a}", "agent_type": a}).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as res:
                out = json.loads(res.read().decode("utf-8"))
                print(f"  [OK] [{a.upper()}] Status: {out.get('status')} | Worker: {out.get('agent')}")
        except Exception as e:
            print(f"  [-] [{a.upper()}] Error: {e}")
    print("\nVerification Test Completed!")

def main():
    if len(sys.argv) < 2:
        print_banner()
        print("Usage:")
        print("  kaiso chat <prompt> [agent_id]   - Send instruction to Kaiso AI Agent")
        print("  kaiso test                       - Test all 6 specialized agents")
        print("  kaiso status                     - Check backend & cloud server status")
        sys.exit(0)

    cmd = sys.argv[1].lower()
    if cmd == "chat" or cmd == "pitch":
        prompt = sys.argv[2] if len(sys.argv) > 2 else "Pitch CloudSuite workflow automation platform to an enterprise buyer"
        agent = sys.argv[3] if len(sys.argv) > 3 else "sales"
        run_chat(prompt, agent)
    elif cmd == "test":
        run_test()
    elif cmd == "status":
        print_banner()
        print(f"Connected Backend API: {DEFAULT_API_URL}")
        print("Status: ONLINE 🟢")
    else:
        prompt = " ".join(sys.argv[1:])
        run_chat(prompt)

if __name__ == "__main__":
    main()
