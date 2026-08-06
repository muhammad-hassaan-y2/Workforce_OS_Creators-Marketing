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

export async function runAgentTask(prompt: string, agentType: string = "mesh"): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("kaiso_access_token") : null;
  const res = await fetch(`${API_BASE_URL}/agents/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ prompt, agent_type: agentType })
  });

  if (!res.ok) {
    throw new Error("Failed to execute agent task.");
  }
  return res.json();
}

export async function runBedrockOrchestration(): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("kaiso_access_token") : null;
  const res = await fetch(`${API_BASE_URL}/bedrock/orchestrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    throw new Error("Failed to execute Bedrock multi-agent orchestration workflow.");
  }
  return res.json();
}
