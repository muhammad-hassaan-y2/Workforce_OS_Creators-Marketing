import os
import json
import urllib.request
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

COCKROACH_MCP_ENDPOINT = os.getenv("COCKROACH_MCP_ENDPOINT", "https://cockroachlabs.cloud/mcp")
COCKROACH_MCP_API_KEY = os.getenv("COCKROACH_MCP_API_KEY", "CCDB1_EeyX7n0P9R2vcBIFlmC7hi_Yt3KwXdxamuUMdz4vIUdBKjaX7GZltJoOocvwELT")
COCKROACH_MCP_CLUSTER_ID = os.getenv("COCKROACH_MCP_CLUSTER_ID", "skinny-canine")
COCKROACH_MCP_DATABASE = os.getenv("COCKROACH_MCP_DATABASE", "openclaw-mcp")


class CockroachMCPService:
    """
    CockroachDB MCP (Model Context Protocol) Cloud API Integration Service.
    Enables autonomous AI agents to query, persist state, and record transaction audit logs
    directly into CockroachDB Serverless Cluster via MCP HTTP JSON-RPC protocol.
    """

    def __init__(self):
        self.endpoint = COCKROACH_MCP_ENDPOINT
        self.api_key = COCKROACH_MCP_API_KEY
        self.cluster_id = COCKROACH_MCP_CLUSTER_ID
        self.database = COCKROACH_MCP_DATABASE

    def _parse_sse_response(self, raw_text: str) -> Dict[str, Any]:
        """Parses Server-Sent Events (SSE) data line into JSON."""
        for line in raw_text.splitlines():
            if line.startswith("data: "):
                json_str = line[6:].strip()
                try:
                    return json.loads(json_str)
                except Exception:
                    pass
        try:
            return json.loads(raw_text)
        except Exception:
            return {"raw_output": raw_text}

    def call_tool(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Invokes a CockroachDB MCP tool via HTTP JSON-RPC POST.
        """
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": name,
                "arguments": arguments
            }
        }

        req_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            self.endpoint,
            data=req_data,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "mcp-cluster-id": self.cluster_id,
                "Content-Type": "application/json"
            },
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                resp_text = resp.read().decode("utf-8")
                parsed = self._parse_sse_response(resp_text)
                return {
                    "status": "SUCCESS",
                    "protocol": "COCKROACHDB_MCP_JSON_RPC",
                    "cluster_id": self.cluster_id,
                    "database": self.database,
                    "result": parsed
                }
        except Exception as err:
            return {
                "status": "FALLBACK_LOCAL_LOG",
                "protocol": "COCKROACHDB_MCP",
                "cluster_id": self.cluster_id,
                "database": self.database,
                "notice": f"CockroachDB MCP Notice: {str(err)}",
                "simulated_mcp_query": arguments.get("query", f"Tool '{name}' invocation")
            }

    def select_query(self, sql_query: str) -> Dict[str, Any]:
        """Executes a SQL SELECT query against CockroachDB via MCP."""
        return self.call_tool("select_query", {
            "database": self.database,
            "query": sql_query
        })

    def execute_query(self, sql_query: str) -> Dict[str, Any]:
        """Executes DDL/DML state changes on CockroachDB via MCP."""
        return self.call_tool("execute_query", {
            "database": self.database,
            "query": sql_query
        })

    def log_agent_event(self, agent_name: str, event_type: str, details: Dict[str, Any]) -> Dict[str, Any]:
        """
        Persists an agent execution event turn into CockroachDB MCP audit logs table.
        """
        sanitized_details = json.dumps(details).replace("'", "''")
        query = f"INSERT INTO agent_audit_logs (agent_name, event_type, details, created_at) VALUES ('{agent_name}', '{event_type}', '{sanitized_details}', NOW());"
        return self.execute_query(query)


cockroach_mcp = CockroachMCPService()
