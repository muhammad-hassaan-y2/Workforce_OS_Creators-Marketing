/// A simple natural language query parser for the OpenClaw CLI.
/// This parses local intents before passing them to the backend or MCP server.

#[derive(Debug, PartialEq)]
pub enum Intent {
    ListAgents,
    InspectAgent(String),
    Unknown(String),
}

pub struct QueryParser;

impl QueryParser {
    pub fn new() -> Self {
        Self
    }

    /// Parses a raw natural language string into a structured Intent.
    pub fn parse(&self, input: &str) -> Intent {
        let lower_input = input.to_lowercase();
        
        if lower_input.contains("list") && lower_input.contains("agent") {
            return Intent::ListAgents;
        }
        
        if lower_input.contains("inspect") || lower_input.contains("show me") {
            // Simple heuristic to extract ID if it exists after the keyword
            let parts: Vec<&str> = input.split_whitespace().collect();
            if let Some(id) = parts.last() {
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
    }

    #[test]
    fn test_parse_unknown() {
        let parser = QueryParser::new();
        assert_eq!(parser.parse("do something else"), Intent::Unknown("do something else".to_string()));
    }
}
