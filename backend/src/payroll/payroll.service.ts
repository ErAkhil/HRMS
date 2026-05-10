import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async getPayrollRuns(user: JwtPayload) {
    const rows = await this.prisma.payrollRun.findMany({
      where: { orgId: user.orgId },
      include: { _count: { select: { payslips: true } } },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
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
  }

  async getLatestRunPayslips(user: JwtPayload) {
    const latestRun = await this.prisma.payrollRun.findFirst({
      where: { orgId: user.orgId, status: 'PROCESSED' },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    if (!latestRun) return [];

    const rows = await this.prisma.payslip.findMany({
      where: { payrollRunId: latestRun.id },
      include: {
        employee: { select: { firstName: true, lastName: true, title: true, avatarUrl: true } },
      },
      orderBy: { netPay: 'desc' },
    });

    return rows.map((p) => ({
      id: p.id,
      employeeName: `${p.employee.firstName} ${p.employee.lastName}`,
      employeeTitle: p.employee.title ?? '—',
      avatarUrl: p.employee.avatarUrl,
      basicSalary: Number(p.basicSalary),
      grossPay: Number(p.grossPay),
      taxDeduction: Number(p.taxDeduction),
      pfDeduction: Number(p.pfDeduction),
      netPay: Number(p.netPay),
      status: latestRun.status,
    }));
  }

  async getMyPayslips(user: JwtPayload) {
    if (!user.employeeId) return [];
    return this.prisma.payslip.findMany({
      where: { employeeId: user.employeeId },
      include: { payrollRun: { select: { month: true, year: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPayslip(id: string, user: JwtPayload) {
    const payslip = await this.prisma.payslip.findFirst({
      where: { id, employee: { orgId: user.orgId } },
      include: {
        employee: {
          select: {
            firstName: true, lastName: true, employeeCode: true,
            email: true, title: true,
            department: { select: { name: true } },
            org: { select: { name: true, address: true, taxId: true } },
          },
        },
        payrollRun: true,
      },
    });

    if (!payslip) throw new NotFoundException('Payslip not found');

    const isOwner = payslip.employeeId === user.employeeId;
    const isHr = ['SUPER_ADMIN', 'HR_ADMIN'].includes(user.role);
    if (!isOwner && !isHr) throw new ForbiddenException();

    return payslip;
  }

  async runPayroll(month: number, year: number, user: JwtPayload) {
    const employees = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
    });

    const payrollRun = await this.prisma.payrollRun.create({
      data: {
        orgId: user.orgId, month, year,
        status: 'PROCESSING',
        totalGross: 0, totalNet: 0, totalDeductions: 0,
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
      totalGross += gross;
      totalDeductions += deductions;
      return {
        employeeId: emp.id, payrollRunId: payrollRun.id,
        basicSalary: basic, hra, allowances, grossPay: gross,
        taxDeduction: tax, pfDeduction: pf, netPay: gross - deductions,
      };
    });

    await this.prisma.payslip.createMany({ data: payslipsData });

    return this.prisma.payrollRun.update({
      where: { id: payrollRun.id },
      data: {
        status: 'PROCESSED',
        totalGross,
        totalNet: totalGross - totalDeductions,
        totalDeductions,
        processedAt: new Date(),
      },
    });
  }

  async getInsights(user: JwtPayload) {
    const [payrollRuns, headcount] = await Promise.all([
      this.prisma.payrollRun.findMany({
        where: { orgId: user.orgId, status: 'PROCESSED' },
        orderBy: [{ year: 'asc' }, { month: 'asc' }],
      }),
      this.prisma.employee.count({ where: { orgId: user.orgId, isActive: true } }),
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const trend = payrollRuns.slice(-6).map((r) => ({
      label: monthNames[r.month - 1] ?? `M${r.month}`,
      total: Number(r.totalGross),
    }));

    const latestRun = payrollRuns[payrollRuns.length - 1] ?? null;
    const latestTotal = latestRun ? Number(latestRun.totalGross) : 0;
    const latestNet = latestRun ? Number(latestRun.totalNet) : 0;
    const latestDeductions = latestRun ? Number(latestRun.totalDeductions) : 0;
    const avgSalary = headcount > 0 && latestTotal > 0 ? Math.round(latestTotal / headcount) : 0;

    let deptCosts: { dept: string; grossTotal: number; count: number }[] = [];
    if (latestRun) {
      const payslips = await this.prisma.payslip.findMany({
        where: { payrollRunId: latestRun.id },
        select: { grossPay: true, employee: { select: { department: { select: { name: true } } } } },
      });
      const deptMap = new Map<string, { grossTotal: number; count: number }>();
      for (const p of payslips) {
        const name = p.employee.department?.name ?? 'Other';
        const d = deptMap.get(name) ?? { grossTotal: 0, count: 0 };
        deptMap.set(name, { grossTotal: d.grossTotal + Number(p.grossPay), count: d.count + 1 });
      }
      deptCosts = Array.from(deptMap.entries())
        .map(([dept, d]) => ({ dept, ...d }))
        .sort((a, b) => b.grossTotal - a.grossTotal);
    }

    return { trend, latestTotal, latestNet, latestDeductions, avgSalary, headcount, deptCosts, hasData: payrollRuns.length > 0 };
  }
}
