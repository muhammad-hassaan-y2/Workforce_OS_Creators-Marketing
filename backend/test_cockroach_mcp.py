import sys
import json
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding='utf-8')
load_dotenv()

def test_cockroach_mcp():
    print("=== Testing CockroachDB MCP Integration ===")
    from cockroach_mcp_service import cockroach_mcp
    
    print(f"Endpoint: {cockroach_mcp.endpoint}")
    print(f"Cluster ID: {cockroach_mcp.cluster_id}")
    print(f"Database: {cockroach_mcp.database}")
    
    # 1. Test Querying CockroachDB MCP via select_query
    print("\n1. Querying CockroachDB MCP (select_query)...")
    res_select = cockroach_mcp.select_query("SELECT 1 AS test_connection;")
    print(json.dumps(res_select, indent=2))

    # 2. Test Logging Agent Turn Event into CockroachDB MCP
    print("\n2. Logging Agent Event into CockroachDB MCP...")
    res_log = cockroach_mcp.log_agent_event(
        agent_name="Jordan (Sales Agent)",
        event_type="LEAD_QUALIFICATION",
        details={
            "lead": "Acme Corp VP Operations",
            "mcp_cluster": cockroach_mcp.cluster_id,
            "status": "QUALIFIED"
        }
    )
    print(json.dumps(res_log, indent=2))

if __name__ == "__main__":
    test_cockroach_mcp()
