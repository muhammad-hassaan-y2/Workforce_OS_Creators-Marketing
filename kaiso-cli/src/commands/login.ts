import chalk from "chalk";
import { login } from "../lib/auth";

export async function loginCommand(): Promise<void> {
  try {
    await login();
  } catch (err) {
    console.error(chalk.red((err as Error).message));
    process.exitCode = 1;
  }
}
