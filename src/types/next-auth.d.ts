import type { UserRole, Plan } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      orgId: string;
      orgName: string;
      plan: Plan;
      employeeId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    orgId: string;
    orgName: string;
    plan: Plan;
    employeeId: string | null;
  }
}
