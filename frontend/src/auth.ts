import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import type { UserRole, Plan } from "@/types/domain";
import type { JWT } from "next-auth/jwt";

const API = process.env.API_URL ?? "http://localhost:3001/api";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json() as { accessToken: string; refreshToken: string };

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000,
    };
  } catch {
    return { ...token, accessToken: "", accessTokenExpires: 0 };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
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

      if (Date.now() < token.accessTokenExpires) return token;

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
