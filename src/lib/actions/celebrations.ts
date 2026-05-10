"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export type CelebrationItem = {
  id: string;
  name: string;
  avatarUrl: string | null;
  dept: string;
  label: string;
  yearsOfService: number;
  daysUntil: number;
};

export async function getUpcomingCelebrations(): Promise<CelebrationItem[]> {
  const user = await requireAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const employees = await db.employee.findMany({
    where: { orgId: user.orgId, isActive: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      startDate: true,
      department: { select: { name: true } },
    },
  });

  const celebrations: CelebrationItem[] = [];

  for (const emp of employees) {
    const start = new Date(emp.startDate);

    // Anniversary in current year; if already past, check next year
    const thisYear = new Date(today.getFullYear(), start.getMonth(), start.getDate());
    const anniversary = thisYear >= today
      ? thisYear
      : new Date(today.getFullYear() + 1, start.getMonth(), start.getDate());

    const yearsOfService = anniversary.getFullYear() - start.getFullYear();
    if (yearsOfService <= 0) continue; // Skip employees in their first year

    const daysUntil = Math.round((anniversary.getTime() - today.getTime()) / 86_400_000);
    if (daysUntil > 7) continue;

    let label: string;
    const years = `${yearsOfService} Year${yearsOfService === 1 ? "" : "s"}`;
    if (daysUntil === 0) label = `🎉 ${years} at ${user.orgName} — Today!`;
    else if (daysUntil === 1) label = `🎉 ${years} at ${user.orgName} — Tomorrow`;
    else label = `🎉 ${years} at ${user.orgName} — in ${daysUntil} days`;

    celebrations.push({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      avatarUrl: emp.avatarUrl,
      dept: emp.department?.name ?? "—",
      label,
      yearsOfService,
      daysUntil,
    });
  }

  return celebrations.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 8);
}
