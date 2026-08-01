import readline from "node:readline";
import chalk from "chalk";
import { loadConfig } from "../lib/config";

export async function chatCommand(prompt?: string): Promise<void> {
  if (!prompt) {
    await startRepl();
    return;
  }
  await sendAndRender(prompt);
}

export async function startRepl(): Promise<void> {
  console.log(chalk.bold.purple("⚡ Kaiso Interactive Agent Terminal"));
  console.log(chalk.gray("Type instructions to command Phone, Video, Browser & CLI agents (or 'exit' to quit).\n"));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan("kaiso> ")
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
    console.log(chalk.dim("\nGoodbye.\n"));
    process.exit(0);
  });
}

async function sendAndRender(text: string): Promise<void> {
  const { apiUrl } = loadConfig();
  console.log(chalk.yellow(`\n[DISPATCH] Sending request to FastAPI Python Agent Worker...`));

  try {
    const res = await fetch(`${apiUrl}/api/agents/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });

    if (!res.ok) {
      throw new Error(`Agent execution failed (HTTP ${res.status}). Is FastAPI backend running at ${apiUrl}?`);
    }

    const data = await res.json();
    
    console.log(chalk.bold.green(`\n🤖 Agent Worker: ${data.agent}`));
    console.log(chalk.bold.white(`  Status: ${data.status}`));
    console.log(chalk.white(`  Output: ${data.message}`));
    
    if (data.data) {
      console.log(chalk.dim(`  Details: ${JSON.stringify(data.data, null, 2)}`));
    }
    console.log();

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Agent Execution Error: ${err.message}\n`));
  }
}
