import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { ApplyLeaveDto } from './dto/apply-leave.dto';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyBalances(user: JwtPayload) {
    if (!user.employeeId) return [];
    const rows = await this.prisma.leaveBalance.findMany({
      where: { employeeId: user.employeeId, year: new Date().getFullYear() },
    });
    return rows.map((b) => ({ ...b, updatedAt: b.updatedAt.toISOString() }));
  }

  async getRequests(user: JwtPayload, status?: string) {
    const isPrivileged = user.role === 'HR_ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'MANAGER';

    const where: Record<string, unknown> = { employee: { orgId: user.orgId } };
    if (!isPrivileged && user.employeeId) where.employeeId = user.employeeId;
    if (status && status !== 'All') where.status = status;

    const rows = await this.prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true, lastName: true, avatarUrl: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((r) => ({
      ...r,
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
      approvedAt: r.approvedAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async applyLeave(dto: ApplyLeaveDto, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1;

    const balance = await this.prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveType_year: {
          employeeId: user.employeeId,
          leaveType: dto.leaveType,
          year: start.getFullYear(),
        },
      },
    });

    if (balance && balance.total - balance.used - balance.pending < days) {
      throw new BadRequestException('Insufficient leave balance');
    }

    const request = await this.prisma.leaveRequest.create({
      data: {
        employeeId: user.employeeId,
        leaveType: dto.leaveType,
        startDate: start,
        endDate: end,
        days,
        reason: dto.reason,
      },
    });

    if (balance) {
      await this.prisma.leaveBalance.update({
        where: { id: balance.id },
        data: { pending: { increment: days } },
      });
    }

    return request;
  }

  async approveLeave(requestId: string, user: JwtPayload) {
    const isPrivileged = ['HR_ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user.role);
    if (!isPrivileged) throw new ForbiddenException('Insufficient permissions');

    const existingRequest = await this.prisma.leaveRequest.findFirst({
      where: { id: requestId, employee: { orgId: user.orgId } },
      select: { id: true },
    });

    if (!existingRequest) throw new NotFoundException('Leave request not found');

    const request = await this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED', approvedBy: user.sub, approvedAt: new Date() },
    });

    await this.prisma.leaveBalance.updateMany({
      where: {
        employeeId: request.employeeId,
        leaveType: request.leaveType,
        year: request.startDate.getFullYear(),
      },
      data: { used: { increment: request.days }, pending: { decrement: request.days } },
    });

    const start = new Date(request.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(request.endDate);
    end.setHours(0, 0, 0, 0);

    const leaveDates: Date[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      leaveDates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    const existing = await this.prisma.attendanceRecord.findMany({
      where: {
        employeeId: request.employeeId,
        date: { gte: start, lte: end },
      },
      select: { id: true, date: true, status: true, checkIn: true, checkOut: true },
    });

    const existingByIsoDate = new Map(
      existing.map((row) => [row.date.toISOString().split('T')[0], row]),
    );

    const createRows = leaveDates
      .filter((day) => !existingByIsoDate.has(day.toISOString().split('T')[0]))
      .map((day) => ({
        employeeId: request.employeeId,
        date: day,
        status: 'ON_LEAVE' as const,
      }));

    if (createRows.length > 0) {
      await this.prisma.attendanceRecord.createMany({
        data: createRows,
        skipDuplicates: true,
      });
    }

    const updatableIds = existing
      .filter((row) => row.status !== 'ON_LEAVE' && !row.checkIn && !row.checkOut)
      .map((row) => row.id);

    if (updatableIds.length > 0) {
      await this.prisma.attendanceRecord.updateMany({
        where: { id: { in: updatableIds } },
        data: { status: 'ON_LEAVE' },
      });
    }

    return request;
  }

  async rejectLeave(requestId: string, user: JwtPayload) {
    const isPrivileged = ['HR_ADMIN', 'SUPER_ADMIN', 'MANAGER'].includes(user.role);
    if (!isPrivileged) throw new ForbiddenException('Insufficient permissions');

    const existingRequest = await this.prisma.leaveRequest.findFirst({
      where: { id: requestId, employee: { orgId: user.orgId } },
      select: { id: true },
    });

    if (!existingRequest) throw new NotFoundException('Leave request not found');

    const request = await this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED', approvedBy: user.sub, approvedAt: new Date() },
    });

    await this.prisma.leaveBalance.updateMany({
      where: {
        employeeId: request.employeeId,
        leaveType: request.leaveType,
        year: request.startDate.getFullYear(),
      },
      data: { pending: { decrement: request.days } },
    });

    return request;
  }

  async cancelLeave(requestId: string, user: JwtPayload) {
    if (!user.employeeId) throw new ForbiddenException('No employee profile');

    const request = await this.prisma.leaveRequest.findFirst({
      where: { id: requestId, employeeId: user.employeeId },
    });

    if (!request) throw new ForbiddenException('Request not found or not yours');
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    await this.prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    await this.prisma.leaveBalance.updateMany({
      where: {
        employeeId: user.employeeId,
        leaveType: request.leaveType,
        year: request.startDate.getFullYear(),
      },
      data: { pending: { decrement: request.days } },
    });

    return { success: true };
  }

  async getSummary(user: JwtPayload) {
    const isHr = ['HR_ADMIN', 'SUPER_ADMIN'].includes(user.role);

    const [pending, approved, rejected] = isHr
      ? await Promise.all([
        this.prisma.leaveRequest.count({ where: { employee: { orgId: user.orgId }, status: 'PENDING' } }),
        this.prisma.leaveRequest.count({ where: { employee: { orgId: user.orgId }, status: 'APPROVED' } }),
        this.prisma.leaveRequest.count({ where: { employee: { orgId: user.orgId }, status: 'REJECTED' } }),
      ])
      : await Promise.all([
        this.prisma.leaveRequest.count({ where: { employeeId: user.employeeId ?? undefined, status: 'PENDING' } }),
        this.prisma.leaveRequest.count({ where: { employeeId: user.employeeId ?? undefined, status: 'APPROVED' } }),
        this.prisma.leaveRequest.count({ where: { employeeId: user.employeeId ?? undefined, status: 'REJECTED' } }),
      ]);

    return {
      pendingCount: pending,
      approvedCount: approved,
      rejectedCount: rejected,
      totalCount: pending + approved + rejected,
    };
  }
}
