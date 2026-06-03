"use server";

import { requireAuth, requireRole } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

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
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  return api.get<SerializedPayrollRun[]>("/payroll/runs");
}

export async function getLatestRunPayslips(): Promise<PayslipRow[]> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  return api.get<PayslipRow[]>("/payroll/runs/latest/payslips");
}

export type PayrollInsights = {
  hasData: boolean;
  latestTotal: number;
  latestNet: number;
  latestDeductions: number;
  avgSalary: number;
  headcount: number;
  trend: { label: string; total: number }[];
  deptCosts: { dept: string; count: number; grossTotal: number }[];
};

export type MyPayslip = {
  id: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossPay: number;
  taxDeduction: number;
  pfDeduction: number;
  otherDeductions: number;
  netPay: number;
  createdAt: string;
  payrollRun: { month: number; year: number; status: string };
};

export async function getPayrollInsights(): Promise<PayrollInsights> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  return api.get<PayrollInsights>("/payroll/insights");
}

export async function getMyPayslips(): Promise<MyPayslip[]> {
  await requireAuth();
  return api.get<MyPayslip[]>("/payroll/me/payslips");
}

export async function getPayslip(id: string) {
  await requireAuth();
  return api.get<unknown>(`/payroll/payslips/${id}`);
}

export async function runPayroll(month: number, year: number) {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  const result = await api.post<unknown>("/payroll/run", { month, year });
  revalidatePath("/payroll");
  return result;
}

export type PayrollMonthlySummary = {
  month: number;
  year: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  status: string;
  processedAt: string | null;
  monthName: string;
};

export async function getPayrollSummaryForMonth(
  month: number,
  year: number
): Promise<PayrollMonthlySummary | null> {
  await requireRole("SUPER_ADMIN", "HR_ADMIN");
  try {
    return await api.get<PayrollMonthlySummary>(
      `/payroll/summary/${year}/${month}`
    );
  } catch {
    return null;
  }
}
