# OpenClaw CLI Documentation

The OpenClaw CLI provides a powerful suite of tools to monitor and interact with the autonomous agents operating inside Workforce OS.

## 🚀 Running the Interactive Dashboard
If you run the CLI with no arguments, it will automatically launch the **Terminal User Interface (TUI)**.

```bash
openclaw-cli
```
Inside the TUI, you can use your keyboard to:
- Press `1` for the **Memory Replay Viewer**
- Press `2` for the **Agent Status Dashboard**
- Press `3` for the **Relationship Graph Funnel**
- Use `Up/Down` or `j/k` arrows to navigate the agent lists.
- Press `q` to safely exit.

---

## 🛠 Command Line Arguments

If you prefer scriptable, headless execution, the CLI supports several subcommands.

### `openclaw-cli agent list`
Lists all registered agents in the database alongside their internal UUIDs.

**Example Usage:**
```bash
$ openclaw-cli agent list
Fetching agents...
- Agent-SEO (2cf0878e-54b5-48e7-9604-86bc7070c8be)
- Agent-Sales (693d2a47-f289-4220-b393-c40f0304e781)
```

### `openclaw-cli agent inspect <UUID>`
Inspects a specific agent by their UUID, returning a beautifully formatted JSON profile containing their role, status, and metadata.

**Example Usage:**
```bash
$ openclaw-cli agent inspect 2cf0878e-54b5-48e7-9604-86bc7070c8be
{
  "id": "2cf0878e-54b5-48e7-9604-86bc7070c8be",
  "name": "Agent-SEO",
  "role": "Search Engine Optimization",
  "status": "ACTIVE"
}
```

---

## 🤖 Natural Language Queries
The CLI features a built-in intent parser. Instead of memorizing commands, you can just ask it what you want to do using the `query` subcommand.

**Example Usage:**
```bash
$ openclaw-cli query please list all agents
=> Intent mapped to 'Agent List'. Executing...
- Agent-SEO (2cf0878e-54b5-48e7-9604-86bc7070c8be)
```

```bash
$ openclaw-cli query inspect agent 2cf0878e-54b5-48e7-9604-86bc7070c8be
=> Intent mapped to 'Agent Inspect' for ID: 2cf0878e-54b5-48e7-9604-86bc7070c8be. Executing...
{
  "name": "Agent-SEO",
  "status": "ACTIVE"
}
```
