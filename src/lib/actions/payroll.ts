"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./audit";
import { toActionError } from "./utils";

export type SerializedPayrollRun = {
  id: string;
  orgId: string;
  month: number;
  year: number;
  status: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count: { payslips: number };
};

export type PayslipRow = {
  id: string;
  employeeName: string;
  employeeTitle: string;
  avatarUrl: string | null;
  basicSalary: number;
  grossPay: number;
  taxDeduction: number;
  pfDeduction: number;
  netPay: number;
  status: string;
};

export async function getPayrollRuns(): Promise<SerializedPayrollRun[]> {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  try {
    const rows = await db.payrollRun.findMany({
      where: { orgId: user.orgId },
      include: { _count: { select: { payslips: true } } },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return rows.map((r) => ({
      ...r,
      totalGross: Number(r.totalGross),
      totalNet: Number(r.totalNet),
      totalDeductions: Number(r.totalDeductions),
      processedAt: r.processedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getLatestRunPayslips(): Promise<PayslipRow[]> {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  try {
    const latestRun = await db.payrollRun.findFirst({
      where: { orgId: user.orgId, status: "PROCESSED" },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    if (!latestRun) return [];

    const rows = await db.payslip.findMany({
      where: { payrollRunId: latestRun.id },
      include: {
        employee: {
          select: { firstName: true, lastName: true, title: true, avatarUrl: true },
        },
      },
      orderBy: { netPay: "desc" },
    });

    return rows.map((p) => ({
      id: p.id,
      employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      employeeTitle: p.employee.title ?? "—",
      avatarUrl: p.employee.avatarUrl,
      basicSalary: Number(p.basicSalary),
      grossPay: Number(p.grossPay),
      taxDeduction: Number(p.taxDeduction),
      pfDeduction: Number(p.pfDeduction),
      netPay: Number(p.netPay),
      status: latestRun.status,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getMyPayslips() {
  const { requireAuth } = await import("@/lib/session");
  const user = await requireAuth();
  if (!user.employeeId) return [];

  try {
    return await db.payslip.findMany({
      where: { employeeId: user.employeeId },
      include: {
        payrollRun: { select: { month: true, year: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getPayslip(id: string) {
  const { requireAuth } = await import("@/lib/session");
  const user = await requireAuth();

  try {
    const payslip = await db.payslip.findFirst({
      where: { id, employee: { orgId: user.orgId } },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeCode: true,
            email: true,
            title: true,
            department: { select: { name: true } },
            org: { select: { name: true, address: true, taxId: true } },
          },
        },
        payrollRun: true,
      },
    });

    if (!payslip) throw new Error("Not found");

    const isOwner = payslip.employeeId === user.employeeId;
    const isHr = ["SUPER_ADMIN", "HR_ADMIN"].includes(user.role);
    if (!isOwner && !isHr) throw new Error("Unauthorized");

    return payslip;
  } catch (err) {
    throw toActionError(err);
  }
}

export async function runPayroll(month: number, year: number) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  try {
    const employees = await db.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
    });

    const payrollRun = await db.payrollRun.create({
      data: {
        orgId: user.orgId,
        month,
        year,
        status: "PROCESSING",
        totalGross: 0,
        totalNet: 0,
        totalDeductions: 0,
      },
    });

    let totalGross = 0;
    let totalDeductions = 0;

    const payslipsData = employees.map((emp) => {
      const basic = Number(emp.salary);
      const hra = basic * 0.4;
      const allowances = basic * 0.1;
      const gross = basic + hra + allowances;
      const tax = gross * 0.1;
      const pf = basic * 0.12;
      const deductions = tax + pf;
      const net = gross - deductions;

      totalGross += gross;
      totalDeductions += deductions;

      return {
        employeeId: emp.id,
        payrollRunId: payrollRun.id,
        basicSalary: basic,
        hra,
        allowances,
        grossPay: gross,
        taxDeduction: tax,
        pfDeduction: pf,
        netPay: net,
      };
    });

    await db.payslip.createMany({ data: payslipsData });

    await db.payrollRun.update({
      where: { id: payrollRun.id },
      data: {
        status: "PROCESSED",
        totalGross,
        totalNet: totalGross - totalDeductions,
        totalDeductions,
        processedAt: new Date(),
      },
    });

    await createAuditLog({
      action: "payroll.processed",
      resource: `Payroll ${month}/${year}`,
      details: `Processed ${employees.length} payslips`,
    });

    revalidatePath("/payroll");
    return payrollRun;
  } catch (err) {
    throw toActionError(err);
  }
}
