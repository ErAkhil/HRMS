import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import type { UserRole, Plan } from "@prisma/client";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
        token.orgId = (user as { orgId: string }).orgId;
        token.orgName = (user as { orgName: string }).orgName;
        token.plan = (user as { plan: Plan }).plan;
        token.employeeId = (user as { employeeId: string | null }).employeeId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.orgId = token.orgId as string;
        session.user.orgName = token.orgName as string;
        session.user.plan = token.plan as Plan;
        session.user.employeeId = token.employeeId as string | null;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            org: { select: { name: true, plan: true } },
            employee: { select: { id: true } },
          },
        });

        if (!user || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          orgId: user.orgId,
          orgName: user.org.name,
          plan: user.org.plan,
          employeeId: user.employee?.id ?? null,
        };
      },
    }),
  ],
});
