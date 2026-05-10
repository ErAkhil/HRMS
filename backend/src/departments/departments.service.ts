import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateDepartmentDto } from './dto/create-department.dto';

const DEFAULT_COLOR = '#6366F1';

@Injectable()
export class DepartmentsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getAll(user: JwtPayload) {
    const departments = await this.prisma.department.findMany({
      where: { orgId: user.orgId },
      include: {
        employees: {
          where: { isActive: true },
          select: { id: true, avatarUrl: true, firstName: true, lastName: true },
          orderBy: { firstName: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const headIds = departments
      .map((d) => d.headId)
      .filter((id): id is string => !!id);

    const heads =
      headIds.length > 0
        ? await this.prisma.employee.findMany({
            where: { id: { in: headIds }, orgId: user.orgId },
            select: { id: true, firstName: true, lastName: true, title: true, avatarUrl: true },
          })
        : [];
    const headMap = new Map(heads.map((h) => [h.id, h]));

    return departments.map((dept) => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      color: dept.color,
      headId: dept.headId,
      head: dept.headId ? (headMap.get(dept.headId) ?? null) : null,
      employeeCount: dept.employees.length,
      sampleEmployees: dept.employees.slice(0, 4),
      createdAt: dept.createdAt.toISOString(),
    }));
  }

  async getWithEmployees(id: string, user: JwtPayload) {
    const dept = await this.prisma.department.findFirst({
      where: { id, orgId: user.orgId },
      include: {
        employees: {
          where: { isActive: true },
          select: {
            id: true, firstName: true, lastName: true, title: true,
            avatarUrl: true, email: true, employeeCode: true,
            employmentType: true, startDate: true,
          },
          orderBy: { firstName: 'asc' },
        },
      },
    });

    if (!dept) throw new NotFoundException('Department not found');

    return {
      ...dept,
      employees: dept.employees.map((e) => ({ ...e, startDate: e.startDate.toISOString() })),
    };
  }

  async create(dto: CreateDepartmentDto, user: JwtPayload, ipAddress: string) {
    const existing = await this.prisma.department.findUnique({
      where: { name_orgId: { name: dto.name, orgId: user.orgId } },
    });
    if (existing) throw new ConflictException(`Department "${dto.name}" already exists`);

    if (dto.headId) {
      const head = await this.prisma.employee.findFirst({
        where: { id: dto.headId, orgId: user.orgId, isActive: true },
      });
      if (!head) throw new NotFoundException('Selected head employee not found');
    }

    const dept = await this.prisma.department.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        color: dto.color ?? DEFAULT_COLOR,
        headId: dto.headId ?? null,
        orgId: user.orgId,
      },
    });

    await this.audit.log(user, {
      action: 'department.created',
      resource: `Department: ${dept.name}`,
      details: `Created department "${dept.name}"`,
      ipAddress,
    });

    return dept;
  }

  async update(id: string, dto: CreateDepartmentDto, user: JwtPayload, ipAddress: string) {
    const current = await this.prisma.department.findFirst({
      where: { id, orgId: user.orgId },
    });
    if (!current) throw new NotFoundException('Department not found');

    if (dto.name !== current.name) {
      const conflict = await this.prisma.department.findFirst({
        where: { name: dto.name, orgId: user.orgId, id: { not: id } },
      });
      if (conflict) throw new ConflictException(`Department "${dto.name}" already exists`);
    }

    if (dto.headId) {
      const head = await this.prisma.employee.findFirst({
        where: { id: dto.headId, orgId: user.orgId, isActive: true },
      });
      if (!head) throw new NotFoundException('Selected head employee not found');
    }

    const dept = await this.prisma.department.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description ?? null,
        color: dto.color ?? DEFAULT_COLOR,
        headId: dto.headId ?? null,
      },
    });

    await this.audit.log(user, {
      action: 'department.updated',
      resource: `Department: ${dept.name}`,
      details: `Updated department "${dept.name}"`,
      ipAddress,
    });

    return dept;
  }

  async delete(id: string, user: JwtPayload, ipAddress: string) {
    const dept = await this.prisma.department.findFirst({
      where: { id, orgId: user.orgId },
      include: { employees: { where: { isActive: true }, select: { id: true } } },
    });
    if (!dept) throw new NotFoundException('Department not found');

    if (dept.employees.length > 0) {
      throw new BadRequestException(
        `Cannot delete "${dept.name}" — ${dept.employees.length} active employee${dept.employees.length !== 1 ? 's' : ''} assigned. Reassign them first.`,
      );
    }

    await this.prisma.department.delete({ where: { id } });

    await this.audit.log(user, {
      action: 'department.deleted',
      resource: `Department: ${dept.name}`,
      details: `Deleted department "${dept.name}"`,
      ipAddress,
    });
  }
}
