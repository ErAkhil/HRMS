import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { UpdateRoleDto } from './dto/update-role.dto';
import type { CreateWorkflowDto } from './dto/create-workflow.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getOrgUsers(user: JwtPayload) {
    const users = await this.prisma.user.findMany({
      where: { orgId: user.orgId },
      include: {
        employee: {
          select: {
            firstName: true, lastName: true, avatarUrl: true, title: true,
            department: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      name: u.employee
        ? `${u.employee.firstName} ${u.employee.lastName}`
        : u.email.split('@')[0],
      avatarUrl: u.employee?.avatarUrl ?? null,
      department: u.employee?.department?.name ?? '—',
      title: u.employee?.title ?? '—',
    }));
  }

  async updateUserRole(dto: UpdateRoleDto, user: JwtPayload, ipAddress: string) {
    const target = await this.prisma.user.findUnique({
      where: { id: dto.userId },
      select: { orgId: true, role: true },
    });

    if (!target || target.orgId !== user.orgId) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { role: dto.role },
    });

    await this.audit.log(user, {
      action: 'user.role_changed',
      resource: `User ${dto.userId}`,
      details: `Role changed from ${target.role} to ${dto.role}`,
      ipAddress,
    });
  }

  async toggleUserActive(userId: string, user: JwtPayload, ipAddress: string) {
    const target = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { orgId: true, isActive: true },
    });

    if (!target || target.orgId !== user.orgId) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !target.isActive },
    });

    await this.audit.log(user, {
      action: target.isActive ? 'user.deactivated' : 'user.activated',
      resource: `User ${userId}`,
      details: `User ${target.isActive ? 'deactivated' : 'activated'}`,
      ipAddress,
    });
  }

  async getWorkflows(user: JwtPayload) {
    return this.prisma.workflow.findMany({
      where: { orgId: user.orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWorkflow(dto: CreateWorkflowDto, user: JwtPayload) {
    return this.prisma.workflow.create({
      data: {
        orgId: user.orgId,
        name: dto.name,
        description: dto.description,
        trigger: dto.trigger,
      },
    });
  }

  async toggleWorkflow(workflowId: string, user: JwtPayload) {
    const wf = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
      select: { orgId: true, isEnabled: true },
    });

    if (!wf || wf.orgId !== user.orgId) throw new NotFoundException('Workflow not found');

    await this.prisma.workflow.update({
      where: { id: workflowId },
      data: { isEnabled: !wf.isEnabled },
    });
  }

  async getSecuritySettings(user: JwtPayload) {
    const org = await this.prisma.organization.findUnique({
      where: { id: user.orgId },
      select: { id: true, name: true, plan: true },
    });

    const [userCount, activeCount, recentLogins] = await Promise.all([
      this.prisma.user.count({ where: { orgId: user.orgId } }),
      this.prisma.user.count({ where: { orgId: user.orgId, isActive: true } }),
      this.prisma.user.findMany({
        where: { orgId: user.orgId, lastLoginAt: { not: null } },
        orderBy: { lastLoginAt: 'desc' },
        take: 5,
        select: { email: true, lastLoginAt: true, role: true },
      }),
    ]);

    return {
      org,
      userCount,
      activeCount,
      recentLogins: recentLogins.map((u) => ({
        email: u.email,
        role: u.role,
        lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      })),
    };
  }
}
