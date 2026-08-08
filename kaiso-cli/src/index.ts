#!/usr/bin/env node
import { Command } from "commander";
import { loginCommand } from "./commands/login";
import { chatCommand, startRepl } from "./commands/chat";
import { draftCommand } from "./commands/draft";
import { configGetCommand, configSetApiUrlCommand } from "./commands/config";
import { 
  orchestrateCommand, 
  personaGenerateCommand, 
  personaListCommand, 
  voiceCallCommand 
} from "./commands/agentCommands";
import { ensureAuthenticated } from "./lib/auth";

const VERSION = "0.2.0";

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
  .command("orchestrate")
  .description("Run 6-step multi-agent orchestration workflow across Sales, Objection, Brand & PM agents")
  .action(orchestrateCommand);

program
  .command("persona")
  .description("Dynamic Agent Persona commands")
  .argument("[action]", "generate | list")
  .argument("[brief]", "Brief prompt for persona generation")
  .action(async (action, brief) => {
    if (action === "list" || !action) {
      await personaListCommand();
    } else if (action === "generate" || action === "create") {
      await personaGenerateCommand(brief);
    } else {
      await personaListCommand();
    }
  });

program
  .command("call [lead]")
  .description("Initiate a sub-310ms neural voice call session with a target lead")
  .action(voiceCallCommand);

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
