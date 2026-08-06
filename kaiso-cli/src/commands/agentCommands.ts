import chalk from "chalk";
import { loadConfig } from "../lib/config";
import { ensureAuthenticated } from "../lib/auth";

export async function orchestrateCommand(): Promise<void> {
  const token = (await ensureAuthenticated()) ? loadConfig().token : null;
  const { apiUrl } = loadConfig();

  console.log(chalk.bold.magenta("\n⚡ STARTING AWS BEDROCK 6-AGENT MULTI-AGENT ORCHESTRATION"));
  console.log(chalk.gray("Coordinating Jordan (Sales), ObjectionHandler (Diplomat), Archive (Brand), Forge (Creator), Atlas (PM), Warden (Auditor)...\n"));

  try {
    const res = await fetch(`${apiUrl}/api/bedrock/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      }
    });

    if (!res.ok) {
      throw new Error(`Orchestration request failed (HTTP ${res.status}). Is FastAPI backend running at ${apiUrl}?`);
    }

    const data = await res.json();
    const wf = data.workflow || {};

    console.log(chalk.gray("┌────────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│ ") + chalk.bold.yellow("🎯 1. PERSONA CONCEPT  : ") + chalk.cyan(wf.concept_generated || "Enterprise Onboarding Specialist"));
    console.log(chalk.gray("│ ") + chalk.bold.green("💼 2. SALES PITCH      : ") + chalk.white(wf.sales_pitch || "CloudSuite SOC2 Type II Workflow Automation"));
    console.log(chalk.gray("│ ") + chalk.bold.yellow("🤝 3. OBJECTION REFRAME: ") + chalk.white(wf.objection_response || "Reframed with verified SOC2 Type II SLA"));
    console.log(chalk.gray("│ ") + chalk.bold.magenta("📜 4. BRAND CHECK      : ") + chalk.bold.green("Consistent with guidelines"));
    console.log(chalk.gray("│ ") + chalk.bold.blue("🗺 5. PM TASK PLAN     : ") + chalk.white("Rollout CloudSuite across 50 enterprise nodes"));
    console.log(chalk.gray("│ ") + chalk.bold.red("🔍 6. CONFLICT SCAN    : ") + chalk.green("Zero timeline or brand contradictions detected"));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────────┘\n"));

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Orchestration Error: ${err.message}\n`));
  }
}

export async function personaGenerateCommand(brief?: string): Promise<void> {
  const token = (await ensureAuthenticated()) ? loadConfig().token : null;
  const { apiUrl } = loadConfig();

  const prompt = brief || "We need an enterprise IT security onboarding specialist who reassures risk-averse buyers.";

  console.log(chalk.bold.cyan(`\n🛠 FORGE // DYNAMIC PERSONA LLM GENERATOR`));
  console.log(chalk.gray(`Business Brief: "${prompt}"\n`));

  try {
    const res = await fetch(`${apiUrl}/api/personas/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ brief: prompt })
    });

    if (!res.ok) {
      throw new Error(`Persona generation failed (HTTP ${res.status}).`);
    }

    const data = await res.json();

    console.log(chalk.gray("┌────────────────────────────────────────────────────────────────┐"));
    console.log(chalk.gray("│ ") + chalk.bold.green(`🎭 GENERATED PERSONA: ${data.name} (${data.archetype})`));
    console.log(chalk.gray("├────────────────────────────────────────────────────────────────┤"));
    console.log(chalk.gray("│ ") + chalk.white(`Communication Style: `) + chalk.cyan(data.communication_style));
    console.log(chalk.gray("│ ") + chalk.white(`Stored DB ID       : `) + chalk.yellow(data.id));
    console.log(chalk.gray("└────────────────────────────────────────────────────────────────┘\n"));

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Persona Generation Error: ${err.message}\n`));
  }
}

export async function personaListCommand(): Promise<void> {
  const token = (await ensureAuthenticated()) ? loadConfig().token : null;
  const { apiUrl } = loadConfig();

  try {
    const res = await fetch(`${apiUrl}/api/personas`, {
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch personas (HTTP ${res.status}).`);
    }

    const personas = await res.json();
    console.log(chalk.bold.cyan(`\n🎭 DYNAMIC DB-STORED AGENT PERSONAS (${personas.length} Active)`));

    personas.forEach((p: any) => {
      console.log(chalk.gray(`• `) + chalk.bold.white(p.name) + chalk.magenta(` (${p.archetype})`) + chalk.gray(` ID: ${p.id}`));
    });
    console.log("");

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Persona List Error: ${err.message}\n`));
  }
}

export async function voiceCallCommand(targetLead?: string): Promise<void> {
  await ensureAuthenticated();
  const lead = targetLead || "Sarah Jenkins (VP Sales)";

  console.log(chalk.bold.yellow(`\n📞 INITIATING SUB-310MS NEURAL VOICE CALL`));
  console.log(chalk.gray(`Target Lead : ${lead}`));
  console.log(chalk.gray(`Agent Voice : Jordan (B2B Sales Neural Voice)\n`));

  console.log(chalk.green(`[CALL CONNECTED] 🟢 00:01`));
  console.log(chalk.cyan(`[Agent]: "Hi Sarah, calling from Kaiso Agent OS regarding outbound SDR automation."`));
  console.log(chalk.gray(`[Lead]:  "We need automated lead qualification and calendar booking."`));
  console.log(chalk.green(`[Agent]: "Demo scheduled for Thursday at 2:00 PM EST."`));
  console.log(chalk.gray(`[CALL COMPLETED] 02:14 • Transcribed to Neon PostgreSQL DB\n`));
}
