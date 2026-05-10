import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async getMeetings(user: JwtPayload) {
    const isPrivileged = user.role === 'HR_ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'MANAGER';
    const ownId = user.employeeId ?? '__NONE__';

    const meetings = await this.prisma.meeting.findMany({
      where: {
        orgId: user.orgId,
        ...(isPrivileged ? {} : { participants: { some: { employeeId: ownId } } }),
      },
      include: {
        participants: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const now = new Date();
    return meetings.map((m) => {
      const endMs = m.scheduledAt.getTime() + m.durationMins * 60 * 1000;
      const isLive = now >= m.scheduledAt && now.getTime() < endMs;
      const isPast = now.getTime() >= endMs;

      return {
        id: m.id,
        title: m.title,
        type: m.type,
        scheduledAt: m.scheduledAt.toISOString(),
        durationMins: m.durationMins,
        platform: m.platform,
        agenda: m.agenda,
        isLive,
        isPast,
        participants: m.participants.map((p) => ({
          id: p.employee.id,
          name: `${p.employee.firstName} ${p.employee.lastName}`,
          avatarUrl: p.employee.avatarUrl,
        })),
      };
    });
  }

  async getMeetingEmployees(user: JwtPayload) {
    const employees = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: {
        id: true, firstName: true, lastName: true,
        avatarUrl: true, title: true,
        department: { select: { name: true } },
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });

    return employees.map((e) => ({
      id: e.id,
      name: `${e.firstName} ${e.lastName}`,
      avatarUrl: e.avatarUrl,
      title: e.title,
      department: e.department?.name ?? null,
    }));
  }

  async createMeeting(dto: CreateMeetingDto, user: JwtPayload) {
    if (dto.participantIds.length === 0) {
      throw new BadRequestException('Add at least one participant');
    }

    const scheduledAt = new Date(`${dto.date}T${dto.time}`);
    if (isNaN(scheduledAt.getTime())) throw new BadRequestException('Invalid date or time');

    return this.prisma.meeting.create({
      data: {
        orgId: user.orgId,
        title: dto.title,
        type: dto.type,
        scheduledAt,
        durationMins: dto.durationMins,
        platform: dto.platform,
        agenda: dto.agenda ?? null,
        createdById: user.sub,
        participants: {
          create: dto.participantIds.map((employeeId) => ({ employeeId })),
        },
      },
    });
  }
}
