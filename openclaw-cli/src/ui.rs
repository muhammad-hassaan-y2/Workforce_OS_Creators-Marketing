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
    WebUI,
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
    let titles: Vec<Line> = vec!["[1] Memory Replay", "[2] Status Dashboard", "[3] Relationship Graph", "[4] Adeele Web UI"]
        .into_iter()
        .map(|t| Line::from(t))
        .collect();
    
    let tab_index = match state.active_tab {
        ActiveTab::MemoryReplay => 0,
        ActiveTab::StatusDashboard => 1,
        ActiveTab::RelationshipGraph => 2,
        ActiveTab::WebUI => 3,
    };

    let tabs = Tabs::new(titles)
        .block(Block::default().borders(Borders::ALL).border_type(ratatui::widgets::BorderType::Rounded).border_style(Style::default().fg(Color::DarkGray)).title(Span::styled(" OpenClaw OS ", Style::default().fg(Color::Magenta).add_modifier(Modifier::BOLD))))
        .select(tab_index)
        .style(Style::default().fg(Color::Cyan))
        .highlight_style(Style::default().fg(Color::Yellow).add_modifier(Modifier::BOLD));
    
    f.render_widget(tabs, chunks[0]);

    // Main Content Area
    match state.active_tab {
        ActiveTab::MemoryReplay => draw_memory_replay(f, state, chunks[1]),
        ActiveTab::StatusDashboard => draw_status_dashboard(f, state, chunks[1]),
        ActiveTab::RelationshipGraph => draw_relationship_graph(f, state, chunks[1]),
        ActiveTab::WebUI => draw_web_ui_tab(f, chunks[1]),
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
        .block(Block::default().title(Span::styled(" Agents ", Style::default().fg(Color::Cyan))).borders(Borders::ALL).border_type(ratatui::widgets::BorderType::Rounded).border_style(Style::default().fg(Color::DarkGray)))
        .highlight_style(Style::default().bg(Color::Blue).fg(Color::White).add_modifier(Modifier::BOLD))
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
        .block(Block::default().title(Span::styled(" Memory Replay ", Style::default().fg(Color::Yellow))).borders(Borders::ALL).border_type(ratatui::widgets::BorderType::Rounded).border_style(Style::default().fg(Color::DarkGray)));
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
        .block(Block::default().title(Span::styled(" Live Agent Status ", Style::default().fg(Color::Green))).borders(Borders::ALL).border_type(ratatui::widgets::BorderType::Rounded).border_style(Style::default().fg(Color::DarkGray)));

    f.render_widget(table, area);
}

fn draw_relationship_graph(f: &mut Frame, state: &AppState, area: ratatui::layout::Rect) {
    let mut tofu = vec![];
    let mut mofu = vec![];
    let mut bofu = vec![];
    let mut post_sale = vec![];
    let mut other = vec![];

    // Categorize agents dynamically based on Hassaan's priorities
    for agent in &state.agents {
        let name = agent.name.to_lowercase();
        let role = agent.role.to_lowercase();
        
        if name.contains("browser") || name.contains("creator") || role.contains("scrap") || role.contains("ad copy") {
            tofu.push(agent);
        } else if name.contains("jordan") || name.contains("phone") || role.contains("sales") || role.contains("outreach") {
            mofu.push(agent);
        } else if name.contains("objection") || name.contains("archive") || name.contains("brand") || role.contains("closing") {
            bofu.push(agent);
        } else if name.contains("atlas") || name.contains("warden") || name.contains("forge") || role.contains("pm") || role.contains("audit") {
            post_sale.push(agent);
        } else {
            other.push(agent);
        }
    }

    let mut buf = String::new();

    buf.push_str("[ 🌐 TOP OF FUNNEL (TOFU): Lead Gen & Scraping ]\n");
    for (i, a) in tofu.iter().enumerate() {
        let prefix = if i == tofu.len() - 1 { " └──" } else { " ├──" };
        buf.push_str(&format!("{} {} ({}) ──> Status: {}\n", prefix, a.name, a.role, a.status));
    }
    buf.push_str("                                  │\n                                  ▼\n");

    buf.push_str("[ 🎯 MIDDLE OF FUNNEL (MOFU): Qualification & Outreach ]\n");
    for (i, a) in mofu.iter().enumerate() {
        let prefix = if i == mofu.len() - 1 { " └──" } else { " ├──" };
        buf.push_str(&format!("{} {} ({}) ──> Status: {}\n", prefix, a.name, a.role, a.status));
    }
    buf.push_str("                                  │\n                                  ▼\n");

    buf.push_str("[ 🤝 BOTTOM OF FUNNEL (BOFU): Objection Handling & Closing ]\n");
    for (i, a) in bofu.iter().enumerate() {
        let prefix = if i == bofu.len() - 1 { " └──" } else { " ├──" };
        buf.push_str(&format!("{} {} ({}) ──> Status: {}\n", prefix, a.name, a.role, a.status));
    }
    buf.push_str("                                  │\n                                  ▼\n");

    buf.push_str("[ 🚀 POST-SALE ONBOARDING & OPS: Execution & Audit ]\n");
    for (i, a) in post_sale.iter().enumerate() {
        let prefix = if i == post_sale.len() - 1 { " └──" } else { " ├──" };
        buf.push_str(&format!("{} {} ({}) ──> Status: {}\n", prefix, a.name, a.role, a.status));
    }

    if !other.is_empty() {
        buf.push_str("\n[ ❓ UNCATEGORIZED AGENTS ]\n");
        for (i, a) in other.iter().enumerate() {
            let prefix = if i == other.len() - 1 { " └──" } else { " ├──" };
            buf.push_str(&format!("{} {} ({}) ──> Status: {}\n", prefix, a.name, a.role, a.status));
        }
    }

    let p = Paragraph::new(buf)
        .style(Style::default().fg(Color::LightCyan))
        .block(Block::default().title(Span::styled(" Funnel Architecture (Dynamic) ", Style::default().fg(Color::Magenta))).borders(Borders::ALL).border_type(ratatui::widgets::BorderType::Rounded).border_style(Style::default().fg(Color::DarkGray)));

    f.render_widget(p, area);
}

fn draw_web_ui_tab(f: &mut Frame, area: ratatui::layout::Rect) {
    let text = "\n\n🚀 Adeele Web UI\n\n\n\
                The OpenClaw CLI is seamlessly integrated with the Adeele Web Dashboard.\n\n\
                To launch the dashboard, press 'q' to exit the TUI, and run:\n\n\
                > openclaw-cli web\n\n\
                This will automatically open your default browser to http://localhost:3000.";

    let p = Paragraph::new(text)
        .style(Style::default().fg(Color::Cyan))
        .alignment(ratatui::layout::Alignment::Center)
        .block(Block::default().title(Span::styled(" Web UI Integration ", Style::default().fg(Color::LightBlue))).borders(Borders::ALL).border_type(ratatui::widgets::BorderType::Rounded).border_style(Style::default().fg(Color::DarkGray)));

    f.render_widget(p, area);
}
