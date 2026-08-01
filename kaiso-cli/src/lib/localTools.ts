import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Local tools only ever touch the filesystem — they never hold API secrets.
// Anything that needs a secret (search, publish, analytics) goes through lib/stream.ts instead.

export function openDraft(filePath: string): void {
  const dir = path.dirname(filePath);
  if (dir && dir !== ".") fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(filePath)) {
    const title = path.basename(filePath, path.extname(filePath));
    fs.writeFileSync(filePath, `# ${title}\n\n`);
  }

  const editor = process.env.EDITOR || process.env.VISUAL || "nano";
  spawnSync(editor, [filePath], { stdio: "inherit" });
}

export function listDrafts(dir = "."): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && [".md", ".txt"].includes(path.extname(entry.name)))
    .map((entry) => entry.name);
}
