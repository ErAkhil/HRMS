import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

interface LogParams {
  action: string;
  resource: string;
  details?: string;
  severity?: string;
  ipAddress?: string;
}

interface LogFilters {
  from?: string;
  to?: string;
  type?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(user: JwtPayload, params: LogParams): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          orgId: user.orgId,
          userId: user.sub,
          userEmail: user.email,
          action: params.action,
          resource: params.resource,
          details: params.details ?? null,
          ipAddress: params.ipAddress ?? 'unknown',
          severity: params.severity ?? 'Info',
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to create audit log: ${params.action} for resource: ${params.resource}`,
        {
          userId: user.sub,
          orgId: user.orgId,
          error: error instanceof Error ? error.message : String(error),
        },
      );
      // Don't throw - audit failures should never impact application flow
      // but they are now logged for operational visibility
    }
  }

  async getLogs(orgId: string | undefined, filters?: LogFilters) {
    const where: Record<string, unknown> = orgId ? { orgId } : {};

    if (filters?.from && filters?.to) {
      where.createdAt = {
        gte: new Date(filters.from),
        lte: new Date(`${filters.to}T23:59:59`),
      };
    }

    if (filters?.type && filters.type !== 'All') {
      where.action = { startsWith: filters.type.toLowerCase() };
    }

    const rows = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  }
}
