import WebSocket from "ws";
import { loadConfig } from "./config";

// Expects the backend to expose: WS /agent/stream
// Sends: { text: string }
// Receives a stream of: { type: "token", text } | { type: "tool_status", label }
//                      | { type: "tool_result", label } | { type: "done" } | { type: "error", message }

export type AgentEvent =
  | { type: "token"; text: string }
  | { type: "tool_status"; label: string }
  | { type: "tool_result"; label: string }
  | { type: "done" }
  | { type: "error"; message: string };

export function streamMessage(text: string, onEvent: (evt: AgentEvent) => void): Promise<void> {
  const { apiUrl, token } = loadConfig();
  if (!token) {
    return Promise.reject(new Error("Not logged in. Run `kaiso login` first."));
  }

  const wsUrl = apiUrl.replace(/^http/, "ws") + "/agent/stream";

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, { headers: { Authorization: `Bearer ${token}` } });

    ws.on("open", () => ws.send(JSON.stringify({ text })));

    ws.on("message", (raw) => {
      let evt: AgentEvent;
      try {
        evt = JSON.parse(raw.toString());
      } catch {
        return;
      }
      onEvent(evt);
      if (evt.type === "done") ws.close();
      if (evt.type === "error") {
        ws.close();
        reject(new Error(evt.message));
      }
    });

    ws.on("close", () => resolve());
    ws.on("error", (err) => reject(err));
  });
}
