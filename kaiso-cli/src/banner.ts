import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";
import { loadConfig } from "./lib/config";

const kaisoGradient = gradient(["#8B5CF6", "#6366F1", "#38BDF8", "#FACC15"]);

export function printBanner(userEmail?: string): void {
  const { apiUrl } = loadConfig();
  console.clear();

  const text = figlet.textSync("KAISO OS", { font: "Standard" });
  console.log(kaisoGradient.multiline(text));

  console.log(chalk.gray("  ╭──────────────────────────────────────────────────────────────╮"));
  console.log(chalk.gray("  │ ") + chalk.bold.cyan("KAISO AGENT OS v0.1.2") + chalk.gray(" // Autonomous Multi-Agent Mesh  │"));
  console.log(chalk.gray("  ├──────────────────────────────────────────────────────────────┤"));
  console.log(
    chalk.gray("  │ ") +
    chalk.yellow("● OPERATOR: ") +
    (userEmail ? chalk.bold.green(userEmail) : chalk.red("Not Signed In (🔒 Required)")) +
    " ".repeat(Math.max(0, 41 - (userEmail ? userEmail.length : 27))) +
    chalk.gray("│")
  );
  console.log(chalk.gray("  │ ") + chalk.cyan("● BACKEND : ") + chalk.white(`FastAPI @ ${apiUrl.replace("http://", "")}`) + " ".repeat(Math.max(0, 36 - apiUrl.replace("http://", "").length)) + chalk.gray("│"));
  console.log(chalk.gray("  │ ") + chalk.magenta("● AGENTS  : ") + chalk.white("Phone Caller (310ms) · Video 4K · Browser · CLI") + chalk.gray(" │"));
  console.log(chalk.gray("  ╰──────────────────────────────────────────────────────────────╯\n"));
}

export function printAuthPrompt(): void {
  console.log(chalk.gray("┌────────────────────────────────────────────────────────────────┐"));
  console.log(chalk.gray("│ ") + chalk.bold.yellow("🔒 KAISO AGENT OS — AUTHENTICATION REQUIRED                    ") + chalk.gray("│"));
  console.log(chalk.gray("├────────────────────────────────────────────────────────────────┤"));
  console.log(chalk.gray("│ ") + chalk.white("You need an authenticated account to dispatch autonomous agents. ") + chalk.gray("│"));
  console.log(chalk.gray("│ ") + chalk.gray("Connected DB: Neon PostgreSQL (Real-Time Auth)                 ") + chalk.gray("│"));
  console.log(chalk.gray("└────────────────────────────────────────────────────────────────┘\n"));
}

export function mark(): string {
  return kaisoGradient("⊚ kaiso");
}
