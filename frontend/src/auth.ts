import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { authConfig } from "./auth.config";
import type { UserRole, Plan } from "@/types/domain";
import type { JWT } from "next-auth/jwt";

const API = process.env.API_URL ?? "http://localhost:3001/api/v1";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type RefreshResponse = { accessToken: string; refreshToken: string };

class RefreshError extends Error {
  status: number;
  retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.status = status;
    this.retryable = retryable;
  }
}

const refreshInFlight = new Map<string, Promise<RefreshResponse>>();

/**
 * Retry utility with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof RefreshError && !error.retryable) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("Max retries exceeded");
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  const refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : "";
  if (!refreshToken) {
    return { ...token, accessToken: "", accessTokenExpires: 0 };
  }

  try {
    const existingRequest = refreshInFlight.get(refreshToken);
    const request = existingRequest ?? retryWithBackoff(async () => {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        const errorMsg = await res.text().catch(() => "Refresh failed");
        const retryable = res.status >= 500;
        throw new RefreshError(`Refresh failed: ${res.status} ${errorMsg}`, res.status, retryable);
      }

      return res.json() as Promise<RefreshResponse>;
    }, 2, 500);

    if (!existingRequest) {
      refreshInFlight.set(refreshToken, request);
    }

    const data = await request;
    refreshInFlight.delete(refreshToken);

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000,
      refreshBackoffUntil: undefined,
    };
  } catch (error) {
    refreshInFlight.delete(refreshToken);

    if (error instanceof RefreshError && error.status === 429) {
      return {
        ...token,
        // Back off refresh attempts for 60s when rate limited.
        refreshBackoffUntil: Date.now() + 60_000,
      };
    }

    return { ...token, accessToken: "", accessTokenExpires: 0 };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${API}/auth/google-signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });
          if (!res.ok) return "/login?error=GoogleAccountNotFound";
          const data = await res.json() as {
            accessToken: string;
            refreshToken: string;
            user: { id: string; email: string; role: UserRole; orgId: string; orgName: string; plan: Plan; employeeId: string | null };
          };
          Object.assign(user, {
            id: data.user.id,
            role: data.user.role,
            orgId: data.user.orgId,
            orgName: data.user.orgName,
            plan: data.user.plan,
            employeeId: data.user.employeeId,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });
        } catch {
          return "/login?error=GoogleSignInFailed";
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          id: string;
          email: string;
          role: UserRole;
          orgId: string;
          orgName: string;
          plan: Plan;
          employeeId: string | null;
          accessToken: string;
          refreshToken: string;
        };
        return {
          ...token,
          id: u.id,
          role: u.role,
          orgId: u.orgId,
          orgName: u.orgName,
          plan: u.plan,
          employeeId: u.employeeId,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: Date.now() + 14 * 60 * 1000,
        };
      }

      const expiresAt = typeof token.accessTokenExpires === "number" ? token.accessTokenExpires : 0;
      if (Date.now() < expiresAt) return token;

      const refreshBackoffUntil = typeof token.refreshBackoffUntil === "number"
        ? token.refreshBackoffUntil
        : 0;
      if (Date.now() < refreshBackoffUntil) return token;

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.orgId = token.orgId;
        session.user.orgName = token.orgName;
        session.user.plan = token.plan;
        session.user.employeeId = token.employeeId;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
          });

          if (!res.ok) return null;

          const data = await res.json() as {
            accessToken: string;
            refreshToken: string;
            user: {
              id: string;
              email: string;
              role: UserRole;
              orgId: string;
              orgName: string;
              plan: Plan;
              employeeId: string | null;
            };
          };

          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            orgId: data.user.orgId,
            orgName: data.user.orgName,
            plan: data.user.plan,
            employeeId: data.user.employeeId,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
