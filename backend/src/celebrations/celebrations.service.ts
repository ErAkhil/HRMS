import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class CelebrationsService {
  constructor(private prisma: PrismaService) {}

  async getUpcoming(user: JwtPayload) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await this.prisma.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: {
        id: true, firstName: true, lastName: true,
        avatarUrl: true, startDate: true,
        department: { select: { name: true } },
      },
    });

    const results: {
      id: string;
      name: string;
      avatarUrl: string | null;
      dept: string;
      label: string;
      yearsOfService: number;
      daysUntil: number;
    }[] = [];

    for (const emp of employees) {
      const start = new Date(emp.startDate);
      const thisYear = new Date(today.getFullYear(), start.getMonth(), start.getDate());
      const anniversary =
        thisYear >= today
          ? thisYear
          : new Date(today.getFullYear() + 1, start.getMonth(), start.getDate());

      const yearsOfService = anniversary.getFullYear() - start.getFullYear();
      if (yearsOfService <= 0) continue;

      const daysUntil = Math.round((anniversary.getTime() - today.getTime()) / 86_400_000);
      if (daysUntil > 7) continue;

      const years = `${yearsOfService} Year${yearsOfService === 1 ? '' : 's'}`;
      let label: string;
      if (daysUntil === 0) label = `${years} at ${user.orgName} — Today!`;
      else if (daysUntil === 1) label = `${years} at ${user.orgName} — Tomorrow`;
      else label = `${years} at ${user.orgName} — in ${daysUntil} days`;

      results.push({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        avatarUrl: emp.avatarUrl,
        dept: emp.department?.name ?? '—',
        label,
        yearsOfService,
        daysUntil,
      });
    }

    return results.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 8);
  }
}
