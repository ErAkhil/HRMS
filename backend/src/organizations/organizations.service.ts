import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateOrgDto } from './dto/create-org.dto';
import type { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getAll() {
    const orgs = await this.prisma.organization.findMany({
      include: {
        _count: { select: { users: true, employees: true } },
        subscription: { select: { status: true, currentPeriodEnd: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orgs.map((o) => ({
      id: o.id,
      name: o.name,
      slug: o.slug,
      plan: o.plan,
      logoUrl: o.logoUrl,
      address: o.address,
      createdAt: o.createdAt.toISOString(),
      userCount: o._count.users,
      employeeCount: o._count.employees,
      subscriptionStatus: o.subscription?.status ?? null,
      subscriptionEnds: o.subscription?.currentPeriodEnd.toISOString() ?? null,
    }));
  }

  async create(dto: CreateOrgDto, user: JwtPayload, ipAddress: string) {
    const [slugExists, emailExists] = await Promise.all([
      this.prisma.organization.findUnique({ where: { slug: dto.slug } }),
      this.prisma.user.findUnique({ where: { email: dto.adminEmail } }),
    ]);
    if (slugExists) throw new ConflictException('Slug already taken');
    if (emailExists) throw new ConflictException('Email already in use');

    const passwordHash = await hash(dto.adminPassword, 12);
    const nameParts = dto.adminName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Admin';

    const newOrg = await this.prisma.organization.create({
      data: { name: dto.name, slug: dto.slug, plan: dto.plan },
    });

    let newUser;
    try {
      newUser = await this.prisma.user.create({
        data: {
          email: dto.adminEmail,
          passwordHash,
          role: 'HR_ADMIN',
          orgId: newOrg.id,
        },
      });
    } catch {
      await this.prisma.organization.delete({ where: { id: newOrg.id } }).catch(() => null);
      throw new ConflictException('Failed to create admin user — email may already be in use');
    }

    try {
      const empCount = await this.prisma.employee.count({ where: { orgId: newOrg.id } });
      await this.prisma.employee.create({
        data: {
          userId: newUser.id,
          orgId: newOrg.id,
          employeeCode: `EMP-${String(empCount + 1).padStart(4, '0')}`,
          firstName,
          lastName,
          email: dto.adminEmail,
          title: 'HR Administrator',
          startDate: new Date(),
          salary: 0,
        },
      });
    } catch {
      // Non-fatal: admin can still log in; employee profile can be created later
    }

    await this.audit.log(user, {
      action: 'org.created',
      resource: `Organization ${newOrg.id}`,
      details: `Created org "${dto.name}" with plan ${dto.plan}`,
      ipAddress,
    });

    return { id: newOrg.id, name: newOrg.name };
  }

  async updatePlan(dto: UpdatePlanDto, user: JwtPayload, ipAddress: string) {
    const org = await this.prisma.organization.findUnique({ where: { id: dto.orgId } });
    if (!org) throw new NotFoundException('Organization not found');

    await this.prisma.organization.update({
      where: { id: dto.orgId },
      data: { plan: dto.plan },
    });

    await this.audit.log(user, {
      action: 'org.plan_changed',
      resource: `Organization ${dto.orgId}`,
      details: `Plan changed from ${org.plan} to ${dto.plan}`,
      ipAddress,
    });
  }

  async delete(orgId: string, user: JwtPayload) {
    if (orgId === user.orgId) {
      throw new ForbiddenException('Cannot delete your own organization');
    }

    const org = await this.prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');

    await this.prisma.organization.delete({ where: { id: orgId } });
  }
}
