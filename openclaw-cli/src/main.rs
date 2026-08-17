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
use std::error::Error;
use std::io;
use std::time::Duration;
use tokio::time::sleep;
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

mod parser;
mod mcp_client;
mod ui;

/// OpenClaw CLI - The unified command line interface for Workforce OS
/// 
/// Provides powerful tools to interact with, monitor, and query autonomous agents 
/// operating within the Workforce OS ecosystem. Run without arguments to launch 
/// the interactive Terminal User Interface (TUI) Dashboard.
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand, Debug)]
enum Commands {
    /// Manage and interact with specific agents in the database
    Agent {
        #[command(subcommand)]
        agent_command: AgentCommands,
    },
    /// Natural Language Query Interface
    /// 
    /// Pass a natural language prompt (e.g., "please list all agents") and the 
    /// internal parser will map it to the correct underlying system commands.
    Query {
        /// The natural language query string (can be unquoted)
        text: Vec<String>,
    },
    /// Open the Adeele Web UI in your default browser
    Web,
}

#[derive(Subcommand, Debug)]
enum AgentCommands {
    /// List all registered agents and their current statuses
    List,
    /// Inspect a specific agent's complete profile and state
    Inspect {
        /// The UUID of the agent to inspect
        id: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    dotenvy::dotenv().ok(); // Load .env file if it exists
    
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Agent { agent_command }) => {
            let mcp_client = mcp_client::McpClient::new();
            match agent_command {
                AgentCommands::List => {
                    println!("Fetching agents via MCP Server...");
                    match mcp_client.list_agents().await {
                        Ok(agents) => {
                            for agent in agents { println!("- {} ({})", agent.name, agent.id); }
                        }
                        Err(e) => println!("Error: {}", e),
                    }
                }
                AgentCommands::Inspect { id } => {
                    if let Ok(_uuid) = uuid::Uuid::parse_str(id) {
                        match mcp_client.inspect_agent(id).await {
                            Ok(agent) => println!("{}", serde_json::to_string_pretty(&agent)?),
                            Err(e) => println!("Error: {}", e),
                        }
                    } else {
                        println!("Error: Invalid UUID format");
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
                    let mcp_client = mcp_client::McpClient::new();
                    match mcp_client.list_agents().await {
                        Ok(agents) => {
                            for agent in agents { println!("- {} ({})", agent.name, agent.id); }
                        }
                        Err(e) => println!("Error: {}", e),
                    }
                }
                parser::Intent::InspectAgent(id) => {
                    println!("=> Intent mapped to 'Agent Inspect' for ID: {}. Executing...", id);
                    let mcp_client = mcp_client::McpClient::new();
                    if let Ok(_uuid) = uuid::Uuid::parse_str(&id) {
                        match mcp_client.inspect_agent(&id).await {
                            Ok(agent) => println!("{}", serde_json::to_string_pretty(&agent)?),
                            Err(e) => println!("Error: {}", e),
                        }
                    } else {
                        println!("Error: Invalid UUID format");
                    }
                }
                parser::Intent::Unknown(text) => {
                    println!("=> Intent unknown. The parser doesn't know how to handle: '{}'", text);
                }
            }
        },
        Some(Commands::Web) => {
            let url = "https://kaiso-os.vercel.app/";
            println!("🚀 Launching Adeele Web UI at {}...", url);
            if open::that(url).is_err() {
                println!("Error: Failed to open default browser. Please manually navigate to {}", url);
            }
        },
        None => {
            // Start the main TUI dashboard if no subcommands provided
            let mcp_client = mcp_client::McpClient::new();
            run_tui(mcp_client).await?;
        }
    }

    Ok(())
}

async fn run_tui(mcp_client: mcp_client::McpClient) -> Result<(), Box<dyn Error>> {
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let mut state = ui::AppState::new();

    // Initial load of agents
    if let Ok(agents) = mcp_client.list_agents().await {
        state.agents = agents;
        state.agent_list_state.select(if state.agents.is_empty() { None } else { Some(0) });
    }
    state.loading = false;
    
    // load memories for the initially selected agent
    if let Some(agent) = state.selected_agent() {
        if let Ok(mems) = mcp_client.get_memories_for_agent(agent.id).await {
            state.selected_memories = mems;
        }
    }

    let mut last_selected_id = state.selected_agent().map(|a| a.id);
    let mut last_poll = std::time::Instant::now();

    loop {
        terminal.draw(|f| ui::draw_ui(f, &mut state))?;

        // non-blocking event poll to keep UI responsive and allow async fetches
        if event::poll(Duration::from_millis(50))? {
            if let Event::Key(key) = event::read()? {
                if key.kind == crossterm::event::KeyEventKind::Press {
                    match key.code {
                        KeyCode::Char('q') => break,
                        KeyCode::Char('1') => state.active_tab = ui::ActiveTab::MemoryReplay,
                        KeyCode::Char('2') => state.active_tab = ui::ActiveTab::StatusDashboard,
                        KeyCode::Char('3') => state.active_tab = ui::ActiveTab::RelationshipGraph,
                        KeyCode::Char('4') => state.active_tab = ui::ActiveTab::WebUI,
                        KeyCode::Down | KeyCode::Char('j') => {
                            if state.active_tab == ui::ActiveTab::MemoryReplay { state.next(); }
                        },
                        KeyCode::Up | KeyCode::Char('k') => {
                            if state.active_tab == ui::ActiveTab::MemoryReplay { state.previous(); }
                        },
                        _ => {}
                    }
                }
            }
        }

        // if the selection changed, fetch the memories for the new agent asynchronously
        let current_selected_id = state.selected_agent().map(|a| a.id);
        if current_selected_id != last_selected_id {
            if let Some(id) = current_selected_id {
                state.loading = true;
                terminal.draw(|f| ui::draw_ui(f, &mut state))?;
                
                if let Ok(mems) = mcp_client.get_memories_for_agent(id).await {
                    state.selected_memories = mems;
                }
                state.loading = false;
            }
            last_selected_id = current_selected_id;
        }

        // Live Background Polling (Every 5 seconds)
        if last_poll.elapsed() >= Duration::from_secs(5) {
            if let Ok(agents) = mcp_client.list_agents().await {
                state.agents = agents;
            }
            if let Some(agent) = state.selected_agent() {
                if let Ok(mems) = mcp_client.get_memories_for_agent(agent.id).await {
                    state.selected_memories = mems;
                }
            }
            last_poll = std::time::Instant::now();
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
