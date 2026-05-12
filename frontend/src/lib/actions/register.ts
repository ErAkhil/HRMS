"use server";

import { z } from "zod";

const API = process.env.API_URL ?? "http://localhost:3001/api";

const registerOrgSchema = z.object({
  orgName: z.string().min(2, "Organization name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export async function registerOrg(data: z.infer<typeof registerOrgSchema>) {
  const parsed = registerOrgSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");

  const res = await fetch(`${API}/auth/register-org`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? "Registration failed. Please try again.");
  }

  return res.json() as Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; orgName: string };
  }>;
}
