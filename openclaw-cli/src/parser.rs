/// A simple natural language query parser for the OpenClaw CLI.
/// This parses local intents before passing them to the backend or MCP server.

use serde::{Deserialize, Serialize};
use reqwest::blocking::Client;
use std::env;

#[derive(Debug, PartialEq)]
pub enum Intent {
    ListAgents,
    InspectAgent(String),
    Unknown(String),
}

#[derive(Serialize)]
struct ParseRequest {
    message: String,
    system_prompt: String,
}

#[derive(Deserialize)]
struct ParseResponse {
    intent: String,
    agent_id: Option<String>,
}

pub struct QueryParser {
    client: Client,
    endpoint: String,
}

impl QueryParser {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
            endpoint: env::var("AWS_AGENTCORE_ENDPOINT")
                .unwrap_or_else(|_| "http://localhost:8000/api/v1/chat".to_string()),
        }
    }

    /// Parses a raw natural language string into a structured Intent using AWS AgentCore LLM.
    pub fn parse(&self, input: &str) -> Intent {
        let req_body = ParseRequest {
            message: input.to_string(),
            system_prompt: "You are an intent parser. Map the user's message to an intent. Options: LIST_AGENTS, INSPECT_AGENT, UNKNOWN. Return a JSON object with 'intent' (string) and 'agent_id' (string, if applicable). Only output raw JSON.".to_string(),
        };

        // Try the AWS AgentCore LLM first
        if let Ok(res) = self.client.post(&self.endpoint).json(&req_body).send() {
            if let Ok(json) = res.json::<ParseResponse>() {
                return match json.intent.as_str() {
                    "LIST_AGENTS" => Intent::ListAgents,
                    "INSPECT_AGENT" => {
                        if let Some(id) = json.agent_id {
                            Intent::InspectAgent(id)
                        } else {
                            Intent::Unknown(input.to_string())
                        }
                    },
                    _ => Intent::Unknown(input.to_string()),
                };
            }
        }
        
        // Fallback to local regex if LLM is offline or fails
        self.local_parse(input)
    }

    fn local_parse(&self, input: &str) -> Intent {
        let lower_input = input.to_lowercase();
        
        if lower_input.contains("list") && lower_input.contains("agent") {
            return Intent::ListAgents;
        }
        
        if lower_input.contains("inspect") || lower_input.contains("show me") {
            let parts: Vec<&str> = input.split_whitespace().collect();
            if let Some(id) = parts.iter().find(|&&p| p.len() == 36 && p.chars().filter(|&c| c == '-').count() == 4) {
                return Intent::InspectAgent(id.to_string());
            } else if let Some(id) = parts.last() {
                if id.len() > 3 {
                    return Intent::InspectAgent(id.to_string());
                }
            }
        }
        
        Intent::Unknown(input.to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_list_agents() {
        let parser = QueryParser::new();
        assert_eq!(parser.parse("list all my agents"), Intent::ListAgents);
        assert_eq!(parser.parse("Can you list the agents please?"), Intent::ListAgents);
    }

    #[test]
    fn test_parse_inspect_agent() {
        let parser = QueryParser::new();
        assert_eq!(parser.parse("inspect agent 1234"), Intent::InspectAgent("1234".to_string()));
        assert_eq!(parser.parse("show me 5678"), Intent::InspectAgent("5678".to_string()));
        
        // Test UUID extraction from anywhere in the sentence
        assert_eq!(
            parser.parse("can you inspect agent 2cf0878e-54b5-48e7-9604-86bc7070c8be for me"),
            Intent::InspectAgent("2cf0878e-54b5-48e7-9604-86bc7070c8be".to_string())
        );
    }

    #[test]
    fn test_parse_unknown() {
        let parser = QueryParser::new();
        assert_eq!(parser.parse("do something else"), Intent::Unknown("do something else".to_string()));
    }
}
