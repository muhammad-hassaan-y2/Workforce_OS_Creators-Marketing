import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

// Matches the logo: indigo -> violet -> blue
const kaisoGradient = gradient(["#4F46E5", "#8B5CF6", "#3B82F6"]);

export function printBanner(): void {
  const text = figlet.textSync("KAISO", { font: "Standard" });
  console.log(kaisoGradient.multiline(text));
  console.log(chalk.gray("  ⊚  AI agent for creators, sales & marketing\n"));
}

export function mark(): string {
  return kaisoGradient("⊚ kaiso");
}
