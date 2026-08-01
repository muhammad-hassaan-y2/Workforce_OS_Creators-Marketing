import { openDraft } from "../lib/localTools";

export async function draftCommand(file: string): Promise<void> {
  openDraft(file);
}
