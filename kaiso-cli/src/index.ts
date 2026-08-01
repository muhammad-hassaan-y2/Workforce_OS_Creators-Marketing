#!/usr/bin/env node
import { Command } from "commander";
import { printBanner } from "./banner";
import { loginCommand } from "./commands/login";
import { chatCommand, startRepl } from "./commands/chat";
import { draftCommand } from "./commands/draft";
import { configGetCommand, configSetApiUrlCommand } from "./commands/config";
import { ensureAuthenticated } from "./lib/auth";

const VERSION = "0.1.3"; // keep in sync with package.json

const program = new Command();

program
  .name("kaiso")
  .description("Kaiso — Autonomous AI Agent CLI for Content Creators, Sales & Marketing")
  .version(VERSION);

program
  .command("login")
  .description("Authenticate this device with your Kaiso account")
  .action(loginCommand);

program
  .command("chat [prompt]")
  .description("Send a message to the agent (omit prompt to open an interactive session)")
  .action(chatCommand);

program
  .command("draft <file>")
  .description("Open or create a local draft file with your editor")
  .action(draftCommand);

const config = program.command("config").description("Manage local CLI configuration");
config.command("get").description("Show the current config").action(configGetCommand);
config
  .command("set-api-url <url>")
  .description("Point the CLI at a different backend URL")
  .action(configSetApiUrlCommand);

async function main() {
  if (process.argv.length <= 2) {
    const user = await ensureAuthenticated();
    await startRepl(user?.email);
    return;
  }
  await program.parseAsync(process.argv);
}

main();
