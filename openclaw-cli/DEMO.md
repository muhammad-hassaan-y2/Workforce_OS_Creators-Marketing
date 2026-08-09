# 🎬 OpenClaw CLI - Official Demo Script

This script is designed for a **60-90 second video demonstration** (perfect for Twitter/X, LinkedIn, or YouTube). It highlights the raw performance, beautiful UI, and deep web integration of the OpenClaw OS control center.

---

## ⏱️ Pre-flight Checklist
- [ ] Have your terminal open and zoomed in so text is clearly visible.
- [ ] Ensure CockroachDB is running and `.env` is properly configured.
- [ ] Have the `frontend` directory ready so the web server boots smoothly.
- [ ] Copy a valid Agent UUID from your database to your clipboard for Step 4.

---

## 🎬 Action! (The Script)

### Step 1: The Boot Up (0:00 - 0:15)
*Action:* Open your terminal and type:
```bash
cargo run
```
*Talking Track:* 
> "Welcome to OpenClaw. While most agent platforms force you into a slow web browser, we built the core OS dashboard entirely in Rust. It’s a blazing-fast, lightweight TUI designed for power users and engineers."

### Step 2: The Funnel Architecture (0:15 - 0:30)
*Action:* Press `3` to navigate to the **Relationship Graph** tab.
*Talking Track:* 
> "Because we’re tied directly to the CockroachDB backend, OpenClaw dynamically maps out the entire autonomous mesh. You can instantly see your Top of Funnel web scrapers handing off data to Middle of Funnel phone agents."

### Step 3: High-Speed Memory Replay (0:30 - 0:45)
*Action:* Press `1` to return to the **Memory Replay** tab. Use the `Down Arrow` to scroll through agents, showing the right panel updating instantly.
*Talking Track:* 
> "Powered by a custom `mimalloc` memory allocator, you can scroll through thousands of live agent execution logs and memory states in real-time without dropping a single frame."

### Step 4: Natural Language Admin (0:45 - 1:05)
*Action:* Press `q` to exit the TUI. In the terminal, run the query parser with your copied UUID:
```bash
cargo run -- query "can you inspect agent <PASTE_UUID_HERE> for me please?"
```
*Talking Track:*
> "You don’t need to write SQL to debug the OS. OpenClaw features a built-in Natural Language parser that instantly interprets conversational commands, extracts the intent, and fetches the exact JSON state of any agent."

### Step 5: The Seamless Web Bridge (1:05 - 1:20)
*Action:* Finally, run:
```bash
cargo run -- web
```
*Talking Track:*
> "And when you do need a visual dashboard for non-technical clients, OpenClaw has you covered. A single command automatically boots the Next.js Kaiso environment in the background and bridges you straight into the web UI."
*(Wait for the browser to pop open, showing the Kaiso dashboard)*

---
**End of Demo** 🏁
