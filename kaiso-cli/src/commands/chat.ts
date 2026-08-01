import readline from "node:readline";
import chalk from "chalk";
import { loadConfig } from "../lib/config";
import { ensureAuthenticated, getCurrentUser } from "../lib/auth";
import { printBanner } from "../banner";

export async function chatCommand(prompt?: string): Promise<void> {
  const user = await ensureAuthenticated();
  if (!prompt) {
    await startRepl(user?.email);
    return;
  }
  await sendAndRender(prompt);
}

export async function startRepl(initialEmail?: string): Promise<void> {
  let userEmail = initialEmail;
  if (!userEmail) {
    const u = await getCurrentUser();
    userEmail = u?.email;
  }

  printBanner(userEmail);

  console.log(chalk.bold.cyan("⚡ Kaiso Agent Terminal") + chalk.gray(" (Claude Code / Codex REPL Mode)"));
  console.log(chalk.gray("Command Phone, Video, Browser & CLI agents directly from your terminal. Type 'exit' to quit.\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.bold.cyan("kaiso ") + chalk.bold.magenta("❯ ")
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (["exit", "quit"].includes(input.toLowerCase())) {
      rl.close();
      return;
    }
    if (input) {
      await sendAndRender(input);
    }
    rl.prompt();
  });

  rl.on("close", () => {
    console.log(chalk.gray("\n[KAISO OS] Session terminated gracefully. Goodbye!\n"));
    process.exit(0);
  });
}

async function sendAndRender(text: string): Promise<void> {
  const { apiUrl, token } = loadConfig();

  console.log(chalk.yellow(`\n╭─ 🚀 DISPATCHING MULTI-AGENT INSTRUCTION`));
  console.log(chalk.gray(`│ Prompt  : "${text}"`));
  console.log(chalk.gray(`│ Backend : ${apiUrl}`));
  console.log(chalk.yellow(`╰─ ⏳ Executing Python Agent Worker...`));

  try {
    const res = await fetch(`${apiUrl}/api/agents/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ prompt: text })
    });

    if (!res.ok) {
      throw new Error(`Agent execution failed (HTTP ${res.status}). Is FastAPI backend running at ${apiUrl}?`);
    }

    const data = await res.json();

    console.log(chalk.gray("\n┌────────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│ ") + chalk.bold.green(`🤖 AGENT EXECUTED: ${data.agent}`) + " ".repeat(Math.max(0, 44 - data.agent.length)) + chalk.gray("│"));
    console.log(chalk.gray("├────────────────────────────────────────────────────────────────┤"));
    console.log(chalk.gray("│ ") + chalk.white(`Status  : `) + chalk.bold.emerald ? chalk.bold.green(data.status) : chalk.bold.green(data.status));
    console.log(chalk.gray("│ ") + chalk.white(`Message : `) + chalk.cyan(data.message));

    if (data.latency_ms) {
      console.log(chalk.gray("│ ") + chalk.white(`Latency : `) + chalk.yellow(`${data.latency_ms}ms`));
    }

    if (data.data) {
      console.log(chalk.gray("├────────────────────────────────────────────────────────────────┤"));
      console.log(chalk.gray("│ ") + chalk.bold.yellow("EXECUTION TELEMETRY & DATA:"));
      const lines = JSON.stringify(data.data, null, 2).split("\n");
      lines.forEach((l) => {
        console.log(chalk.gray("│   ") + chalk.gray(l));
      });
    }

    console.log(chalk.gray("└────────────────────────────────────────────────────────────────┘\n"));

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Agent Execution Error: ${err.message}\n`));
  }
}
