import { auth } from "@/auth";

const BASE = process.env.API_URL ?? "http://localhost:3001/api";

async function getAccessToken(): Promise<string> {
  const session = await auth();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken;
}

async function apiRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json() as { message?: string | string[] };
      if (err.message) {
        message = Array.isArray(err.message) ? err.message[0] : err.message;
      }
    } catch { /* ignore */ }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>("GET", path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>("PATCH", path, body),
  put: <T>(path: string, body?: unknown) => apiRequest<T>("PUT", path, body),
  delete: <T>(path: string) => apiRequest<T>("DELETE", path),
};
