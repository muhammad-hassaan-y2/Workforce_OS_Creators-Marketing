import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CONFIG_DIR = path.join(os.homedir(), ".kaiso");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export interface KaisoConfig {
  apiUrl: string;
  token?: string;
}

function defaults(): KaisoConfig {
  return {
    apiUrl: process.env.KAISO_API_URL || "http://localhost:8000",
  };
}

export function loadConfig(): KaisoConfig {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return { ...defaults(), ...JSON.parse(raw) };
  } catch {
    return defaults();
  }
}

export function saveConfig(patch: Partial<KaisoConfig>): void {
  const next = { ...loadConfig(), ...patch };
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  // 0600: readable/writable only by the current user, since this file holds an auth token
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2), { mode: 0o600 });
}

export function clearToken(): void {
  const next = loadConfig();
  delete next.token;
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(next, null, 2), { mode: 0o600 });
}
