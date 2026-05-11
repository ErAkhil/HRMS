import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateEmployeeDto } from './dto/create-employee.dto';
import type { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: JwtPayload) {
    const rows = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      include: { department: { select: { name: true } } },
      orderBy: { firstName: 'asc' },
    });

    return rows.map((e) => ({
      id: e.id,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      phone: e.phone,
      title: e.title,
      employeeCode: e.employeeCode,
      employmentType: e.employmentType,
      avatarUrl: e.avatarUrl,
      isActive: e.isActive,
      startDate: e.startDate.toISOString(),
      department: e.department,
    }));
  }

  async findOne(id: string, user: JwtPayload) {
    const emp = await this.prisma.employee.findFirst({
      where: { id, orgId: user.orgId },
      include: {
        department: { select: { id: true, name: true, color: true } },
        manager: { select: { firstName: true, lastName: true, title: true } },
        leaveBalances: { where: { year: new Date().getFullYear() } },
        goals: { where: { status: { not: 'COMPLETED' } }, take: 5 },
      },
    });

    if (!emp) throw new NotFoundException('Employee not found');

    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      title: emp.title,
      employeeCode: emp.employeeCode,
      employmentType: emp.employmentType,
      startDate: emp.startDate.toISOString(),
      salary: Number(emp.salary),
      avatarUrl: emp.avatarUrl,
      isActive: emp.isActive,
      departmentId: emp.departmentId,
      department: emp.department,
      manager: emp.manager,
      leaveBalances: emp.leaveBalances.map((lb) => ({
        id: lb.id,
        leaveType: lb.leaveType,
        total: lb.total,
        used: lb.used,
        pending: lb.pending,
        year: lb.year,
      })),
      goals: emp.goals.map((g) => ({
        id: g.id,
        title: g.title,
        status: g.status,
        dueDate: g.dueDate?.toISOString() ?? null,
      })),
    };
  }

  async getMyProfile(user: JwtPayload) {
    if (!user.employeeId) return null;

    const [emp, goalsDone, tasksDone, coursesCount, certsCount] = await Promise.all([
      this.prisma.employee.findUnique({
        where: { id: user.employeeId },
        include: { department: { select: { name: true } } },
      }),
      this.prisma.goal.count({ where: { employeeId: user.employeeId, status: 'COMPLETED' } }),
      this.prisma.task.count({ where: { assigneeId: user.employeeId, status: 'DONE' } }),
      this.prisma.courseEnrollment.count({ where: { employeeId: user.employeeId } }),
      this.prisma.employeeCertification.count({ where: { employeeId: user.employeeId } }),
    ]);

    if (!emp) return null;

    return {
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      title: emp.title,
      department: emp.department?.name ?? null,
      avatarUrl: emp.avatarUrl ?? null,
      startDate: emp.startDate.toISOString(),
      employmentType: emp.employmentType,
      goalsDone,
      tasksDone,
      coursesCount,
      certsCount,
    };
  }

  async getOrgChart(user: JwtPayload) {
    const rows = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        avatarUrl: true,
        managerId: true,
        department: { select: { name: true } },
      },
      orderBy: [{ managerId: 'asc' }, { firstName: 'asc' }],
    });
    return rows;
  }

  async getDepartments(user: JwtPayload) {
    return this.prisma.department.findMany({
      where: { orgId: user.orgId },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateEmployeeDto, user: JwtPayload) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('A user with this email already exists');

    const tempPassword =
      Math.random().toString(36).slice(-10) +
      Math.random().toString(36).slice(-4).toUpperCase();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role ?? 'EMPLOYEE',
        orgId: user.orgId,
      },
    });

    const count = await this.prisma.employee.count({ where: { orgId: user.orgId } });
    const employeeCode = `EMP-${String(count + 1).padStart(4, '0')}`;

    const employee = await this.prisma.employee.create({
      data: {
        userId: newUser.id,
        orgId: user.orgId,
        employeeCode,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        title: dto.title,
        departmentId: dto.departmentId,
        employmentType: dto.employmentType ?? 'Full-time',
        startDate: new Date(dto.startDate),
        salary: dto.salary,
      },
    });

    return { ...employee, salary: Number(employee.salary), tempPassword };
  }

  async update(id: string, dto: UpdateEmployeeDto, user: JwtPayload) {
    const employee = await this.prisma.employee.findFirst({ where: { id, orgId: user.orgId } });
    if (!employee) throw new NotFoundException('Employee not found');

    return this.prisma.employee.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone ?? null,
        title: dto.title,
        departmentId: dto.departmentId ?? null,
        employmentType: dto.employmentType ?? 'Full-time',
        salary: dto.salary,
      },
    });
  }

  async deactivate(id: string, user: JwtPayload) {
    const employee = await this.prisma.employee.findFirst({ where: { id, orgId: user.orgId } });
    if (!employee) throw new NotFoundException('Employee not found');
    if (employee.id === user.employeeId) {
      throw new BadRequestException('Cannot deactivate your own account');
    }

    await this.prisma.employee.update({ where: { id }, data: { isActive: false } });
    await this.prisma.user.update({ where: { id: employee.userId }, data: { isActive: false } });

    return { success: true };
  }
}
