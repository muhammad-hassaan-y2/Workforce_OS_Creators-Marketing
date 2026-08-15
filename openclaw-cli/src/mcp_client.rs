use reqwest::Client;
use serde_json::{json, Value};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Agent {
    pub id: uuid::Uuid,
    pub name: String,
    pub role: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Memory {
    pub id: uuid::Uuid,
    pub agent_id: uuid::Uuid,
    pub fact: String,
    pub fact_type: String,
}

pub struct McpClient {
    client: Client,
    endpoint: String,
    api_key: String,
    cluster_id: String,
    database: String,
}

impl McpClient {
    pub fn new() -> Result<Self, Box<dyn std::error::Error>> {
        let endpoint = env::var("MCP_ENDPOINT")
            .unwrap_or_else(|_| "https://cockroachlabs.cloud/mcp".to_string());
        let api_key = env::var("MCP_API_KEY").expect("MCP_API_KEY must be set in .env");
        let cluster_id = env::var("MCP_CLUSTER_ID").expect("MCP_CLUSTER_ID must be set in .env");
        let database = env::var("MCP_DATABASE").unwrap_or_else(|_| "defaultdb".to_string());

        Ok(Self {
            client: Client::new(),
            endpoint,
            api_key,
            cluster_id,
            database,
        })
    }

    fn parse_sse_response(text: &str) -> Result<Value, Box<dyn std::error::Error>> {
        for line in text.lines() {
            if let Some(json_str) = line.strip_prefix("data: ") {
                let val: Value = serde_json::from_str(json_str)?;
                return Ok(val);
            }
        }
        Err(format!("No valid 'data: ' line found in SSE: {}", text).into())
    }

    async fn call_tool(&self, name: &str, arguments: Value) -> Result<Value, Box<dyn std::error::Error>> {
        let req_body = json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": name,
                "arguments": arguments
            }
        });

        let res = self.client
            .post(&self.endpoint)
            .bearer_auth(&self.api_key)
            .header("mcp-cluster-id", &self.cluster_id)
            .json(&req_body)
            .send()
            .await?;

        let text = res.text().await?;
        let json_resp = Self::parse_sse_response(&text)?;

        if let Some(err) = json_resp.get("error") {
            return Err(format!("MCP Server returned error: {:?}", err).into());
        }

        if let Some(content) = json_resp["result"]["content"][0]["text"].as_str() {
            if let Ok(parsed_json) = serde_json::from_str::<Value>(content) {
                return Ok(parsed_json);
            }
            return Ok(json!({ "output": content }));
        }

        Err("No text content returned from tool".into())
    }

    pub async fn list_agents(&self) -> Result<Vec<Agent>, Box<dyn std::error::Error>> {
        let args = json!({
            "database": self.database,
            "query": "SELECT * FROM agents LIMIT 100"
        });

        let val = self.call_tool("select_query", args).await?;
        let agents: Vec<Agent> = serde_json::from_value(val)?;
        Ok(agents)
    }

    pub async fn inspect_agent(&self, id: &str) -> Result<Agent, Box<dyn std::error::Error>> {
        let args = json!({
            "database": self.database,
            "query": format!("SELECT * FROM agents WHERE id = '{}' LIMIT 1", id)
        });

        let val = self.call_tool("select_query", args).await?;
        let agents: Vec<Agent> = serde_json::from_value(val)?;
        agents.into_iter().next().ok_or_else(|| "Agent not found".into())
    }
    
    pub async fn get_memories_for_agent(&self, agent_id: uuid::Uuid) -> Result<Vec<Memory>, Box<dyn std::error::Error>> {
        let args = json!({
            "database": self.database,
            "query": format!("SELECT * FROM long_term_memory WHERE agent_id = '{}' ORDER BY created_at DESC LIMIT 50", agent_id)
        });

        let val = self.call_tool("select_query", args).await?;
        let memories: Vec<Memory> = serde_json::from_value(val)?;
        Ok(memories)
    }
}
