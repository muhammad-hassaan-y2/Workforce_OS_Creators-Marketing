import chalk from "chalk";
import { loadConfig, saveConfig } from "../lib/config";

export function configGetCommand(): void {
  const { apiUrl } = loadConfig();
  console.log(`api-url: ${apiUrl}`);
}

export function configSetApiUrlCommand(url: string): void {
  saveConfig({ apiUrl: url });
  console.log(chalk.green(`✓ api-url set to ${url}`));
}
