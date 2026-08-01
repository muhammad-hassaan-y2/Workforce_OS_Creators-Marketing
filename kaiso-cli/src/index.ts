#!/usr/bin/env node
import { Command } from "commander";
import { printBanner } from "./banner";
import { loginCommand } from "./commands/login";
import { chatCommand, startRepl } from "./commands/chat";
import { draftCommand } from "./commands/draft";
import { configGetCommand, configSetApiUrlCommand } from "./commands/config";

const VERSION = "0.1.0"; // keep in sync with package.json

const program = new Command();

program
  .name("kaiso")
  .description("Kaiso — AI agent CLI for content creators, sales & marketing")
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
  // Running `kaiso` with no arguments opens the branded interactive session,
  // same as `kaiso chat` with no prompt.
  if (process.argv.length <= 2) {
    printBanner();
    await startRepl();
    return;
  }
  await program.parseAsync(process.argv);
}

main();
