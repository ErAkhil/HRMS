import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboard: DashboardService) {}

  @Get('manager')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  getManagerData(@CurrentUser() user: JwtPayload) {
    return this.dashboard.getManagerData(user);
  }

  @Get('leadership')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  getLeadershipData(@CurrentUser() user: JwtPayload) {
    return this.dashboard.getLeadershipData(user);
  }

  @Get('hr')
  @Roles('SUPER_ADMIN', 'HR_ADMIN')
  getHrData(@CurrentUser() user: JwtPayload) {
    return this.dashboard.getHrData(user);
  }
}
