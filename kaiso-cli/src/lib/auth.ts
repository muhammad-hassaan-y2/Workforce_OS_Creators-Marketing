import chalk from "chalk";
import readline from "node:readline";
import { loadConfig, saveConfig } from "./config";
import { printAuthPrompt } from "../banner";

export interface UserProfile {
  email: string;
  full_name: string;
  role: string;
}

function promptInput(query: string, hidden: boolean = false): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    if (hidden) {
      process.stdout.write(query);
      let input = "";
      process.stdin.on("data", (char) => {
        char = char.toString();
        switch (char) {
          case "\n":
          case "\r":
          case "\u0004":
            process.stdin.removeAllListeners("data");
            break;
          default:
            input += char;
            break;
        }
      });
      rl.on("close", () => {
        console.log();
        resolve(input.trim());
      });
    } else {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { apiUrl, token } = loadConfig();
  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
}

export async function ensureAuthenticated(): Promise<UserProfile | null> {
  let user = await getCurrentUser();
  if (user) return user;

  printAuthPrompt();
  console.log(chalk.cyan("Select Authentication Option:"));
  console.log(chalk.white("  [1] Sign In (Existing Account)"));
  console.log(chalk.white("  [2] Create Account (Real-Time FastAPI / Neon DB)"));
  console.log(chalk.gray("  [3] Skip & Run as Guest\n"));

  const choice = await promptInput(chalk.bold.yellow("Choice [1/2/3]: "));

  if (choice === "1") {
    await login();
    return await getCurrentUser();
  } else if (choice === "2") {
    await signup();
    return await getCurrentUser();
  } else {
    console.log(chalk.gray("\nContinuing as Sandbox Guest...\n"));
    return null;
  }
}

export async function login(): Promise<void> {
  const { apiUrl } = loadConfig();

  console.log(chalk.bold.magenta("\n🔒 Kaiso Agent OS CLI — Terminal Sign In"));
  console.log(chalk.gray(`Connecting to FastAPI Backend: ${apiUrl}\n`));

  const email = await promptInput(chalk.cyan("Enter Email: "));
  if (!email) {
    console.log(chalk.red("Email is required. Cancelled."));
    return;
  }

  const password = await promptInput(chalk.cyan("Enter Password: "), true);
  if (!password) {
    console.log(chalk.red("Password is required. Cancelled."));
    return;
  }

  console.log(chalk.yellow("\nAuthenticating with FastAPI & Neon DB..."));

  try {
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Authentication failed (HTTP ${res.status}).`);
    }

    const data = (await res.json()) as { access_token: string; user: UserProfile };

    saveConfig({ token: data.access_token });
    console.log(chalk.bold.green(`\n✓ Authentication Successful!`));
    console.log(chalk.white(`  Operator: ${chalk.bold(data.user.full_name || data.user.email)}`));
    console.log(chalk.white(`  Role    : ${chalk.magenta(data.user.role)}`));
    console.log(chalk.gray(`  Token saved to ~/.kaiso/config.json\n`));

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Login Failed: ${err.message}\n`));
  }
}

export async function signup(): Promise<void> {
  const { apiUrl } = loadConfig();

  console.log(chalk.bold.magenta("\n🚀 Kaiso Agent OS CLI — Account Registration"));
  console.log(chalk.gray(`Connecting to FastAPI Backend: ${apiUrl}\n`));

  const fullName = await promptInput(chalk.cyan("Full Name: "));
  const email = await promptInput(chalk.cyan("Work or Creator Email: "));
  const password = await promptInput(chalk.cyan("Password: "), true);
  const role = await promptInput(chalk.cyan("Role (creator/agency/sales) [default: creator]: "));

  if (!email || !password) {
    console.log(chalk.red("Email and password are required. Cancelled."));
    return;
  }

  console.log(chalk.yellow("\nCreating account in Neon PostgreSQL DB..."));

  try {
    const res = await fetch(`${apiUrl}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName || email.split("@")[0],
        role: role || "creator"
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Signup failed (HTTP ${res.status}).`);
    }

    const data = (await res.json()) as { access_token: string; user: UserProfile };

    saveConfig({ token: data.access_token });
    console.log(chalk.bold.green(`\n✓ Account Created & Authenticated!`));
    console.log(chalk.white(`  Welcome to Kaiso Agent OS, ${chalk.bold(data.user.full_name)}`));
    console.log(chalk.gray(`  Token saved to ~/.kaiso/config.json\n`));

  } catch (err: any) {
    console.error(chalk.red(`\n✖ Signup Failed: ${err.message}\n`));
  }
}
