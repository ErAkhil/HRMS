import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        db: 'ok',
        latencyMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'degraded',
        db: 'unreachable',
        latencyMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
