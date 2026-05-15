import { getSession } from "@/lib/session";

const BASE = process.env.API_URL ?? "http://localhost:3001/api/v1";

type ApiRequestOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

async function getAccessToken(): Promise<string> {
  const session = await getSession();
  if (!session?.accessToken) throw new Error("Not authenticated");
  return session.accessToken;
}

async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  const token = await getAccessToken();

  const requestInit: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: options?.cache ?? "no-store",
  };

  const hasRevalidate = typeof options?.revalidate === "number";
  if (hasRevalidate || options?.tags) {
    requestInit.next = {
      ...(hasRevalidate ? { revalidate: options.revalidate } : {}),
      ...(options.tags ? { tags: options.tags } : {}),
    };
  }

  const res = await fetch(`${BASE}${path}`, requestInit);

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    const err = await res.json().catch(() => null) as { message?: string | string[] } | null;
    if (err?.message) {
      message = Array.isArray(err.message) ? err.message[0] : err.message;
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) => apiRequest<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => apiRequest<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => apiRequest<T>("PATCH", path, body, options),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => apiRequest<T>("PUT", path, body, options),
  delete: <T>(path: string, options?: ApiRequestOptions) => apiRequest<T>("DELETE", path, undefined, options),
};
