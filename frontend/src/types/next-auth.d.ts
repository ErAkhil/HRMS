import type { UserRole, Plan } from "@/types/domain";
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
    accessToken: string;
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
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}
