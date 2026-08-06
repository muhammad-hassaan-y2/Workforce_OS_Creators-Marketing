use clap::{Parser, Subcommand};
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::{Backend, CrosstermBackend},
    layout::{Constraint, Direction, Layout},
    widgets::{Block, Borders, Paragraph},
    Terminal,
};
use std::{error::Error, io};

mod mcp_client;
mod parser;

/// OpenClaw CLI
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Agent related commands
    Agent {
        #[command(subcommand)]
        agent_command: AgentCommands,
    },
    /// Natural Language Query parsing
    Query {
        /// The query string (can be unquoted)
        text: Vec<String>,
    },
}

#[derive(Subcommand, Debug)]
enum AgentCommands {
    /// List all agents
    List,
    /// Inspect a specific agent
    Inspect {
        /// The ID of the agent to inspect
        id: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenvy::dotenv().ok(); // Load .env file if it exists
    
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Agent { agent_command }) => {
            // Only connect to MCP if we are running an agent subcommand
            let mcp = mcp_client::McpClient::new()?;
            
            match agent_command {
                AgentCommands::List => {
                    println!("Fetching agents via CockroachDB MCP Server...");
                    match mcp.list_agents().await {
                        Ok(agents) => {
                            if agents.is_empty() {
                                println!("No agents found or tools returned empty array.");
                            } else {
                                for agent in agents {
                                    println!("- {}", agent);
                                }
                            }
                        }
                        Err(e) => println!("Error: {}", e),
                    }
                }
                AgentCommands::Inspect { id } => {
                    println!("Inspecting agent {} via MCP Server...", id);
                    match mcp.inspect_agent(id).await {
                        Ok(agent) => {
                            println!("Agent Profile:");
                            println!("{}", serde_json::to_string_pretty(&agent)?);
                        }
                        Err(e) => println!("Error: {}", e),
                    }
                }
            }
        },
        Some(Commands::Query { text }) => {
            let query_str = text.join(" ");
            println!("Parsing natural language query: '{}'", query_str);
            
            let p = parser::QueryParser::new();
            match p.parse(&query_str) {
                parser::Intent::ListAgents => {
                    println!("=> Intent mapped to 'Agent List'. Executing...");
                    let mcp = mcp_client::McpClient::new()?;
                    match mcp.list_agents().await {
                        Ok(agents) => {
                            for agent in agents { println!("- {}", agent); }
                        }
                        Err(e) => println!("Error: {}", e),
                    }
                }
                parser::Intent::InspectAgent(id) => {
                    println!("=> Intent mapped to 'Agent Inspect' for ID: {}. Executing...", id);
                    let mcp = mcp_client::McpClient::new()?;
                    match mcp.inspect_agent(&id).await {
                        Ok(agent) => println!("{}", serde_json::to_string_pretty(&agent)?),
                        Err(e) => println!("Error: {}", e),
                    }
                }
                parser::Intent::Unknown(text) => {
                    println!("=> Intent unknown. The parser doesn't know how to handle: '{}'", text);
                    println!("(Try something like 'list agents' or 'inspect <id>')");
                }
            }
        },
        None => {
            // Start the main TUI dashboard if no subcommands provided
            run_tui().await?;
        }
    }

    Ok(())
}

async fn run_tui() -> Result<(), Box<dyn Error>> {
    // setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // run app
    let res = run_app(&mut terminal).await;

    // restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = res {
        println!("{:?}", err)
    }

    Ok(())
}

async fn run_app<B: Backend>(terminal: &mut Terminal<B>) -> io::Result<()> 
where
    io::Error: From<<B as Backend>::Error>,
{
    loop {
        terminal.draw(|f| ui(f))?;

        if event::poll(std::time::Duration::from_millis(50))? {
            if let Event::Key(key) = event::read()? {
                if let KeyCode::Char('q') = key.code {
                    return Ok(());
                }
            }
        }
    }
}

fn ui(f: &mut ratatui::Frame) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(1)
        .constraints([Constraint::Percentage(100)].as_ref())
        .split(f.area());

    let block = Block::default().title("OpenClaw TUI Dashboard (Press 'q' to quit)").borders(Borders::ALL);
    let paragraph = Paragraph::new("Welcome to the OpenClaw Dashboard! (MCP Integration pending for TUI)").block(block);
    f.render_widget(paragraph, chunks[0]);
}
