import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskPriority } from '@prisma/client';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { CreateProjectDto } from './dto/create-project.dto';
import type { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private serializeTask(t: {
    id: string; title: string; description: string | null;
    status: string; priority: string; dueDate: Date | null;
    project: { name: string } | null;
    assignee: { firstName: string; lastName: string; avatarUrl: string | null } | null;
  }) {
    return {
      id: t.id, title: t.title, description: t.description,
      status: t.status, priority: t.priority,
      dueDate: t.dueDate?.toISOString() ?? null,
      project: t.project, assignee: t.assignee,
    };
  }

  async getMyTasks(user: JwtPayload) {
    if (!user.employeeId) return [];
    const rows = await this.prisma.task.findMany({
      where: {
        orgId: user.orgId,
        OR: [{ assigneeId: user.employeeId }, { createdById: user.employeeId }],
      },
      include: {
        assignee: { select: { firstName: true, lastName: true, avatarUrl: true } },
        project: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.serializeTask(row));
  }

  async getOrgTasks(user: JwtPayload) {
    const rows = await this.prisma.task.findMany({
      where: { orgId: user.orgId },
      include: {
        assignee: { select: { firstName: true, lastName: true, avatarUrl: true } },
        project: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => this.serializeTask(row));
  }

  async getProjects(user: JwtPayload) {
    const rows = await this.prisma.project.findMany({
      where: { orgId: user.orgId },
      include: {
        _count: { select: { tasks: true } },
        tasks: { select: { status: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((p) => {
      const total = p._count.tasks;
      const done = p.tasks.filter((t) => t.status === 'DONE').length;
      return {
        id: p.id, name: p.name, description: p.description, status: p.status,
        startDate: p.startDate?.toISOString() ?? null,
        dueDate: p.dueDate?.toISOString() ?? null,
        totalTasks: total, doneTasks: done,
        progress: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });
  }

  async getTeamWorkload(user: JwtPayload) {
    const employees = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: {
        id: true, firstName: true, lastName: true, avatarUrl: true,
        tasks: { where: { orgId: user.orgId }, select: { status: true } },
      },
    });
    return employees
      .map((e) => ({
        name: `${e.firstName} ${e.lastName}`,
        avatarUrl: e.avatarUrl,
        tasks: e.tasks.length,
        done: e.tasks.filter((t) => t.status === 'DONE').length,
      }))
      .filter((e) => e.tasks > 0)
      .sort((a, b) => b.tasks - a.tasks)
      .slice(0, 8);
  }

  async createTask(dto: CreateTaskDto, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    return this.prisma.task.create({
      data: {
        orgId: user.orgId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority ?? 'MEDIUM',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        assigneeId: dto.assigneeId,
        projectId: dto.projectId,
        createdById: user.employeeId,
      },
    });
  }

  async updateTaskStatus(taskId: string, status: TaskStatus, user: JwtPayload) {
    await this.prisma.task.updateMany({
      where: { id: taskId, orgId: user.orgId },
      data: { status, updatedAt: new Date() },
    });
    return { success: true };
  }

  async updateTask(
    taskId: string,
    dto: { title?: string; priority?: string; dueDate?: string | null },
    user: JwtPayload,
  ) {
    await this.prisma.task.updateMany({
      where: { id: taskId, orgId: user.orgId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.priority !== undefined && { priority: dto.priority as TaskPriority }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        updatedAt: new Date(),
      },
    });
    return { success: true };
  }

  async deleteTask(taskId: string, user: JwtPayload) {
    await this.prisma.task.deleteMany({
      where: { id: taskId, orgId: user.orgId },
    });
    return { success: true };
  }

  async createProject(dto: CreateProjectDto, user: JwtPayload) {
    return this.prisma.project.create({
      data: {
        orgId: user.orgId,
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }
}
