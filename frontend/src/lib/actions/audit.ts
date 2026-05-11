"use server";

import { requireRole } from "@/lib/session";
import { api } from "@/lib/api-client";

export type SerializedAuditLog = {
  id: string;
  orgId: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  details: string | null;
  ipAddress: string | null;
  severity: string;
  createdAt: string;
};

// Kept for compatibility — NestJS handles audit logging internally
export async function createAuditLog(_params: {
  action: string;
  resource: string;
  details?: string;
  severity?: string;
}) {
  // no-op: audit logs are written by the NestJS API on every mutation
}

export async function getAuditLogs(filters?: {
  from?: string;
  to?: string;
  type?: string;
}): Promise<SerializedAuditLog[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const params = new URLSearchParams();
  if (filters?.from) params.set("from", filters.from);
  if (filters?.to) params.set("to", filters.to);
  if (filters?.type && filters.type !== "All") params.set("type", filters.type);

  const qs = params.toString();
  return api.get<SerializedAuditLog[]>(`/audit/logs${qs ? `?${qs}` : ""}`);
}
