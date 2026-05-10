import type { UserRole, Plan } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
  orgId: string;
  orgName: string;
  plan: Plan;
  employeeId: string | null;
};
