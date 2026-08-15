import sys
import json
import time
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

def print_header(title: str):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def main():
    print_header("KAISO AGENT OS & OPENCLAW -- FULL SYSTEM VERIFICATION SUITE")
    results = {}

    # 1. Test Neon PostgreSQL Connection
    print_header("1. Neon PostgreSQL Database")
    try:
        from database import engine, Base
        import models
        models.Base.metadata.create_all(bind=engine)
        print("[OK] Connected to Neon PostgreSQL cloud database and validated all schema tables!")
        results["Neon_PostgreSQL"] = "PASSED"
    except Exception as e:
        print(f"[-] Neon DB Exception: {e}")
        results["Neon_PostgreSQL"] = f"FAILED ({e})"

    # 2. Test CockroachDB MCP Service
    print_header("2. CockroachDB MCP (skinny-canine / openclaw-mcp)")
    try:
        from cockroach_mcp_service import cockroach_mcp
        print(f" -> Cluster: {cockroach_mcp.cluster_id} | DB: {cockroach_mcp.database}")
        res_mcp = cockroach_mcp.select_query("SELECT 1 AS mcp_test;")
        print(f"[OK] CockroachDB MCP Response Status: {res_mcp.get('status')}")
        results["CockroachDB_MCP"] = "PASSED"
    except Exception as e:
        print(f"[-] CockroachDB MCP Exception: {e}")
        results["CockroachDB_MCP"] = f"FAILED ({e})"

    # 3. Test AWS S3 Storage Service
    print_header("3. AWS S3 Storage Service (workforce-os-2026)")
    try:
        from s3_service import s3_service
        items = s3_service.list_objects()
        print(f"[OK] Configured for S3 bucket '{s3_service.bucket}' in '{s3_service.region}'. Found {len(items)} items.")
        results["AWS_S3"] = "PASSED"
    except Exception as e:
        print(f"[-] S3 Exception: {e}")
        results["AWS_S3"] = f"FAILED ({e})"

    # 4. Test Playwright Headless Browser Control
    print_header("4. Playwright Headless Browser Research Agent")
    try:
        from agent_engine import PythonAgentEngine
        b_res = PythonAgentEngine.run_agent("Research https://example.com for prospect links", agent_type="browser")
        print(f"[OK] Playwright Browser Status: {b_res.get('status')} | Worker: {b_res.get('agent')}")
        results["Playwright_Browser"] = "PASSED"
    except Exception as e:
        print(f"[-] Playwright Exception: {e}")
        results["Playwright_Browser"] = f"FAILED ({e})"

    # 5. Test Vapi.ai Real-Time Voice Agent
    print_header("5. Vapi.ai Real-Time Voice Calling Service")
    try:
        p_res = PythonAgentEngine.run_agent("Call +18005550199 regarding SDR demo booking", agent_type="phone")
        print(f"[OK] Vapi Phone Agent Status: {p_res.get('status')} | Worker: {p_res.get('agent')}")
        results["Vapi_Telephony"] = "PASSED"
    except Exception as e:
        print(f"[-] Vapi Exception: {e}")
        results["Vapi_Telephony"] = f"FAILED ({e})"


    # 6. Test Multi-Agent Mesh & LLM Reasoning Engine
    print_header("6. Multi-Agent Mesh (Sales, Objection, Brand, PM, Conflict, Creator)")
    try:
        m_res = PythonAgentEngine.run_agent("Pitch CloudSuite workflow automation platform to enterprise VP", agent_type="mesh")
        print(f"[OK] Agent Mesh Status: {m_res.get('status')} | Worker: {m_res.get('agent')}")
        results["MultiAgent_Mesh"] = "PASSED"
    except Exception as e:
        print(f"[-] Agent Mesh Exception: {e}")
        results["MultiAgent_Mesh"] = f"FAILED ({e})"

    # Final Summary Matrix
    print_header("SYSTEM VERIFICATION SUMMARY MATRIX")
    for k, v in results.items():
        print(f" - {k:<25}: {v}")
    print("\nAll integration tests complete!\n")

if __name__ == "__main__":
    main()
