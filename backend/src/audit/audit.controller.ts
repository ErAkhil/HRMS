import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GetAuditLogsDto } from './dto/get-audit-logs.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR_ADMIN', 'SUPER_ADMIN')
export class AuditController {
  constructor(private audit: AuditService) {}

  @Get('logs')
  getLogs(@Query() dto: GetAuditLogsDto, @CurrentUser() user: JwtPayload) {
    return this.audit.getLogs(user.orgId, dto);
  }
}
