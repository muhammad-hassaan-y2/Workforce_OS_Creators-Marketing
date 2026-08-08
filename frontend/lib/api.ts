// FastAPI Backend Authentication & AWS Bedrock Agent API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface ThreadItem {
  id: string;
  title: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageItem {
  id: string;
  thread_id: string;
  sender: "user" | "assistant";
  agent_id?: string;
  text: string;
  agent_widget?: any;
  timestamp: string;
  created_at: string;
}

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("kaiso_access_token") : null;
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function signupUser(email: string, password: string, fullName: string, role: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
      role: role || "creator"
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Signup failed. Please try again.");
  }

  const data: AuthResponse = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("kaiso_access_token", data.access_token);
    localStorage.setItem("kaiso_user", JSON.stringify(data.user));
  }
  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Invalid email or password.");
  }

  const data: AuthResponse = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("kaiso_access_token", data.access_token);
    localStorage.setItem("kaiso_user", JSON.stringify(data.user));
  }
  return data;
}

export async function fetchThreads(): Promise<ThreadItem[]> {
  const res = await fetch(`${API_BASE_URL}/threads`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function createThread(title: string = "New Conversation", agentId: string = "mesh"): Promise<ThreadItem> {
  const res = await fetch(`${API_BASE_URL}/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ title, agent_id: agentId })
  });
  if (!res.ok) throw new Error("Failed to create chat thread");
  return res.json();
}

export async function fetchThreadMessages(threadId: string): Promise<ChatMessageItem[]> {
  const res = await fetch(`${API_BASE_URL}/threads/${threadId}/messages`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) return [];
  return res.json();
}

export async function deleteThread(threadId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/threads/${threadId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error("Failed to delete thread");
  return res.json();
}

export async function postChatMessage(threadId: string, text: string, agentId: string = "mesh"): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/threads/${threadId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ text, agent_id: agentId })
  });
  if (!res.ok) throw new Error("Failed to post message");
  return res.json();
}

export async function runAgentTask(prompt: string, agentType: string = "mesh"): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/agents/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    },
    body: JSON.stringify({ prompt, agent_type: agentType })
  });

  if (!res.ok) {
    throw new Error("Failed to execute agent task.");
  }
  return res.json();
}

export async function runBedrockOrchestration(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/bedrock/orchestrate`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader()
    }
  });

  if (!res.ok) {
    throw new Error("Failed to execute Bedrock multi-agent orchestration workflow.");
  }
  return res.json();
}

export async function fetchCounters(): Promise<{ hot_leads: number; tasks_due_today: number; copy_pending_review: number }> {
  const res = await fetch(`${API_BASE_URL}/counters`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return { hot_leads: 8, tasks_due_today: 14, copy_pending_review: 5 };
  return res.json();
}

export async function fetchLeads(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/leads`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchLeadDetails(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/leads/${id}`, { headers: { ...getAuthHeader() } });
  if (!res.ok) throw new Error("Lead not found");
  return res.json();
}

export async function updateLead(id: string, data: any): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/leads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update lead");
  return res.json();
}

export async function fetchCampaigns(): Promise<{ campaigns: any[]; tasks: any[] }> {
  const res = await fetch(`${API_BASE_URL}/campaigns`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return { campaigns: [], tasks: [] };
  return res.json();
}

export async function fetchCopyReview(taskId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/copy_review`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return null;
  return res.json();
}

export async function postCopyAction(taskId: string, action: "approve" | "request_changes", note: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/tasks/${taskId}/copy_review/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ action, note })
  });
  if (!res.ok) throw new Error("Failed to post copy review action");
  return res.json();
}

export async function fetchCalls(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/calls`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAnalytics(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/analytics`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return {};
  return res.json();
}

export async function fetchIntegrations(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/settings/integrations`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBrandGuidelines(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/settings/brand`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchTeamSettings(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/settings/team`, { headers: { ...getAuthHeader() } });
  if (!res.ok) return {};
  return res.json();
}
