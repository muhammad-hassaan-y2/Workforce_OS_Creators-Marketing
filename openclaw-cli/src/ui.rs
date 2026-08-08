use crate::db::{Agent, Memory};
use ratatui::{
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, ListState, Paragraph, Tabs, Table, Row, Cell},
    Frame,
};

#[derive(PartialEq)]
pub enum ActiveTab {
    MemoryReplay,
    StatusDashboard,
    RelationshipGraph,
}

pub struct AppState {
    pub active_tab: ActiveTab,
    pub agents: Vec<Agent>,
    pub agent_list_state: ListState,
    pub selected_memories: Vec<Memory>,
    pub loading: bool,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            active_tab: ActiveTab::MemoryReplay,
            agents: vec![],
            agent_list_state: ListState::default(),
            selected_memories: vec![],
            loading: true,
        }
    }

    pub fn next(&mut self) {
        if self.agents.is_empty() { return; }
        let i = match self.agent_list_state.selected() {
            Some(i) => {
                if i >= self.agents.len() - 1 { 0 } else { i + 1 }
            }
            None => 0,
        };
        self.agent_list_state.select(Some(i));
    }

    pub fn previous(&mut self) {
        if self.agents.is_empty() { return; }
        let i = match self.agent_list_state.selected() {
            Some(i) => {
                if i == 0 { self.agents.len() - 1 } else { i - 1 }
            }
            None => 0,
        };
        self.agent_list_state.select(Some(i));
    }

    pub fn selected_agent(&self) -> Option<&Agent> {
        self.agent_list_state.selected().map(|i| &self.agents[i])
    }
}

pub fn draw_ui(f: &mut Frame, state: &mut AppState) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .margin(1)
        .constraints([Constraint::Length(3), Constraint::Min(0)].as_ref())
        .split(f.area());

    // Tabs Menu
    let titles: Vec<Line> = vec!["[1] Memory Replay", "[2] Status Dashboard", "[3] Relationship Graph"]
        .into_iter()
        .map(|t| Line::from(t))
        .collect();
    
    let tab_index = match state.active_tab {
        ActiveTab::MemoryReplay => 0,
        ActiveTab::StatusDashboard => 1,
        ActiveTab::RelationshipGraph => 2,
    };

    let tabs = Tabs::new(titles)
        .block(Block::default().borders(Borders::ALL).title("OpenClaw OS"))
        .select(tab_index)
        .style(Style::default().fg(Color::Cyan))
        .highlight_style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD));
    
    f.render_widget(tabs, chunks[0]);

    // Main Content Area
    match state.active_tab {
        ActiveTab::MemoryReplay => draw_memory_replay(f, state, chunks[1]),
        ActiveTab::StatusDashboard => draw_status_dashboard(f, state, chunks[1]),
        ActiveTab::RelationshipGraph => draw_relationship_graph(f, chunks[1]),
    }
}

fn draw_memory_replay(f: &mut Frame, state: &mut AppState, area: ratatui::layout::Rect) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(30), Constraint::Percentage(70)].as_ref())
        .split(area);

    let agents: Vec<ListItem> = state.agents.iter().map(|a| {
        ListItem::new(Line::from(vec![
            Span::styled(format!("{} ", a.name), Style::default().add_modifier(Modifier::BOLD)),
            Span::styled(format!("({})", a.role), Style::default().fg(Color::DarkGray)),
        ]))
    }).collect();

    let agents_list = List::new(agents)
        .block(Block::default().title("Agents").borders(Borders::ALL))
        .highlight_style(Style::default().bg(Color::Blue).fg(Color::White))
        .highlight_symbol(">> ");

    f.render_stateful_widget(agents_list, chunks[0], &mut state.agent_list_state);

    let memory_content = if state.loading {
        "Loading...".to_string()
    } else if let Some(agent) = state.selected_agent() {
        if state.selected_memories.is_empty() {
            format!("No memories found for {}.", agent.name)
        } else {
            let mut buf = String::new();
            for mem in &state.selected_memories {
                buf.push_str(&format!("[{}] {}\n\n", mem.fact_type.to_uppercase(), mem.fact));
            }
            buf
        }
    } else {
        "Select an agent to view their memory log.".to_string()
    };

    let p = Paragraph::new(memory_content)
        .block(Block::default().title("Memory Replay").borders(Borders::ALL));
    f.render_widget(p, chunks[1]);
}

fn draw_status_dashboard(f: &mut Frame, state: &AppState, area: ratatui::layout::Rect) {
    let header = Row::new(vec!["ID", "Name", "Role", "Status"])
        .style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD))
        .bottom_margin(1);

    let rows: Vec<Row> = state.agents.iter().map(|a| {
        let status_color = if a.status.to_lowercase() == "active" { Color::Green } else { Color::Red };
        Row::new(vec![
            Cell::from(a.id.to_string()),
            Cell::from(a.name.clone()),
            Cell::from(a.role.clone()),
            Cell::from(a.status.clone()).style(Style::default().fg(status_color)),
        ])
    }).collect();

    let widths = [
        Constraint::Length(38),
        Constraint::Percentage(25),
        Constraint::Percentage(25),
        Constraint::Percentage(20),
    ];

    let table = Table::new(rows, widths)
        .header(header)
        .block(Block::default().title("Live Agent Status").borders(Borders::ALL));

    f.render_widget(table, area);
}

fn draw_relationship_graph(f: &mut Frame, area: ratatui::layout::Rect) {
    let graph_text = r#"
[ 🌐 TOP OF FUNNEL (TOFU): Lead Gen & Scraping ]
 ├── Browser Control Agent ──> Scrapes B2B Prospect Lists & Submits Forms
 └── Creator Agent ───────────> Generates Ad Copy, Viral Hooks & Video Scripts
                                  │
                                  ▼
[ 🎯 MIDDLE OF FUNNEL (MOFU): Qualification & Outreach ]
 ├── Jordan (Sales Agent) ────> BANT Lead Qualification & Deal ROI Calculation
 └── Phone Caller Agent ──────> Sub-310ms Neural Voice Outreach & Demo Booking
                                  │
                                  ▼
[ 🤝 BOTTOM OF FUNNEL (BOFU): Objection Handling & Closing ]
 ├── ObjectionHandler ────────> De-escalates Pricing & SLA Objections ($499 Floor)
 └── Archive (Brand) ─────────> Audits Proposals & Ad Copy (Zero Hallucinations)
                                  │
                                  ▼
[ 🚀 POST-SALE ONBOARDING & OPS: Execution & Audit ]
 ├── Atlas (PM Planner) ──────> 4-Phase Client Project Rollout (On lead.status=CLOSED_WON)
 ├── Warden (Auditor) ────────> Database Write-Lock & Conflict Scanner
 └── Forge (Agent Creator) ───> Generates Custom Specialized Agents at Runtime
    "#;

    let p = Paragraph::new(graph_text)
        .style(Style::default().fg(Color::LightCyan))
        .block(Block::default().title("Funnel Architecture").borders(Borders::ALL));

    f.render_widget(p, area);
}
