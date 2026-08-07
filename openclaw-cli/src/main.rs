use clap::{Parser, Subcommand};
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::{Backend, CrosstermBackend},
    Terminal,
};
use std::{error::Error, io};
use std::time::Duration;

mod mcp_client;
mod parser;
mod db;
mod ui;

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
            let mcp = mcp_client::McpClient::new()?;
            match agent_command {
                AgentCommands::List => {
                    println!("Fetching agents...");
                    match mcp.list_agents().await {
                        Ok(agents) => {
                            for agent in agents { println!("- {}", agent); }
                        }
                        Err(e) => println!("Error: {}", e),
                    }
                }
                AgentCommands::Inspect { id } => {
                    match mcp.inspect_agent(id).await {
                        Ok(agent) => println!("{}", serde_json::to_string_pretty(&agent)?),
                        Err(e) => println!("Error: {}", e),
                    }
                }
            }
        },
        Some(Commands::Query { text }) => {
            let query_str = text.join(" ");
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
                }
            }
        },
        None => {
            // Start the main TUI dashboard if no subcommands provided
            let db_client = db::DbClient::new().await?;
            run_tui(db_client).await?;
        }
    }

    Ok(())
}

async fn run_tui(db_client: db::DbClient) -> Result<(), Box<dyn Error>> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let mut state = ui::AppState::new();

    // Initial load of agents
    if let Ok(agents) = db_client.list_agents().await {
        state.agents = agents;
        state.agent_list_state.select(if state.agents.is_empty() { None } else { Some(0) });
    }
    state.loading = false;
    
    // load memories for the initially selected agent
    if let Some(agent) = state.selected_agent() {
        if let Ok(mems) = db_client.get_memories_for_agent(agent.id).await {
            state.selected_memories = mems;
        }
    }

    let mut last_selected_id = state.selected_agent().map(|a| a.id);

    loop {
        terminal.draw(|f| ui::draw_ui(f, &mut state))?;

        // non-blocking event poll to keep UI responsive and allow async fetches
        if event::poll(Duration::from_millis(50))? {
            if let Event::Key(key) = event::read()? {
                match key.code {
                    KeyCode::Char('q') => break,
                    KeyCode::Down | KeyCode::Char('j') => state.next(),
                    KeyCode::Up | KeyCode::Char('k') => state.previous(),
                    _ => {}
                }
            }
        }

        // if the selection changed, fetch the memories for the new agent asynchronously
        let current_selected_id = state.selected_agent().map(|a| a.id);
        if current_selected_id != last_selected_id {
            if let Some(id) = current_selected_id {
                state.loading = true;
                terminal.draw(|f| ui::draw_ui(f, &mut state))?;
                
                if let Ok(mems) = db_client.get_memories_for_agent(id).await {
                    state.selected_memories = mems;
                }
                state.loading = false;
            }
            last_selected_id = current_selected_id;
        }
    }

    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    Ok(())
}
