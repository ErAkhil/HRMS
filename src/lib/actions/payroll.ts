"use server";

import { db } from "@/lib/db";
import { requireRole } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "./audit";

export async function getPayrollRuns() {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  return db.payrollRun.findMany({
    where: { orgId: user.orgId },
    include: { _count: { select: { payslips: true } } },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

export async function getMyPayslips() {
  const { requireAuth } = await import("@/lib/session");
  const user = await requireAuth();
  if (!user.employeeId) return [];

  return db.payslip.findMany({
    where: { employeeId: user.employeeId },
    include: {
      payrollRun: { select: { month: true, year: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPayslip(id: string) {
  const { requireAuth } = await import("@/lib/session");
  const user = await requireAuth();

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
}

export async function runPayroll(month: number, year: number) {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

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
}
