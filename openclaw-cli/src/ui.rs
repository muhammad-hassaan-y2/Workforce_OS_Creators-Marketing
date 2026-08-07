use crate::db::{Agent, DbClient, Memory};
use ratatui::{
    backend::Backend,
    layout::{Constraint, Direction, Layout},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, List, ListItem, ListState, Paragraph},
    Frame,
};

pub struct AppState {
    pub agents: Vec<Agent>,
    pub agent_list_state: ListState,
    pub selected_memories: Vec<Memory>,
    pub loading: bool,
}

impl AppState {
    pub fn new() -> Self {
        Self {
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
        .direction(Direction::Horizontal)
        .margin(1)
        .constraints([Constraint::Percentage(30), Constraint::Percentage(70)].as_ref())
        .split(f.area());

    // Left pane: Agents List
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

    // Right pane: Memory Replay
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
