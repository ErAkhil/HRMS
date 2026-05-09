"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { headers } from "next/headers";

interface AuditParams {
  action: string;
  resource: string;
  details?: string;
  severity?: string;
}

export async function createAuditLog(params: AuditParams) {
  try {
    const user = await requireAuth();
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ??
      headersList.get("x-real-ip") ??
      "unknown";

    await db.auditLog.create({
      data: {
        orgId: user.orgId,
        userId: user.id,
        userEmail: user.email ?? "",
        action: params.action,
        resource: params.resource,
        details: params.details,
        ipAddress: ip,
        severity: params.severity ?? "Info",
      },
    });
  } catch {
    // Audit log failures must never break the main flow
  }
}

export async function getAuditLogs(filters?: {
  from?: string;
  to?: string;
  type?: string;
}) {
  const user = await requireAuth();

  const where: Record<string, unknown> = { orgId: user.orgId };

  if (filters?.from && filters?.to) {
    where.createdAt = {
      gte: new Date(filters.from),
      lte: new Date(filters.to + "T23:59:59"),
    };
  }

  if (filters?.type && filters.type !== "All") {
    where.action = { startsWith: filters.type.toLowerCase() };
  }

  return db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}
