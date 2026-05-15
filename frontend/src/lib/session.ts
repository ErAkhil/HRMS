import { auth } from "@/auth";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { UserRole, Plan } from "@/types/domain";

const getCachedSession = cache(async () => auth());

export async function getSession() {
  const session = await getCachedSession();
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireRole(...roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/");
  return user;
}

const PLAN_RANK: Record<Plan, number> = {
  BASIC: 0,
  PRO: 1,
  PRO_PLUS: 2,
  PRO_MAX: 3,
};

export async function requirePlan(minPlan: Plan) {
  const user = await requireAuth();
  if (PLAN_RANK[user.plan] < PLAN_RANK[minPlan]) {
    redirect("/upgrade");
  }
  return user;
}

export function hasPlanAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  return PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan];
}
