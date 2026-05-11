import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CalendarQueryDto } from './dto/calendar-query.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Get()
  getReportsData(@CurrentUser() user: JwtPayload) {
    return this.reports.getReportsData(user);
  }

  @Get('analytics')
  getAnalytics(@CurrentUser() user: JwtPayload) {
    return this.reports.getAnalytics(user);
  }

  @Get('leave-calendar')
  getLeaveCalendar(@Query() dto: CalendarQueryDto, @CurrentUser() user: JwtPayload) {
    return this.reports.getLeaveCalendar(dto.month, dto.year, user);
  }

  @Get('calendar')
  getCalendarData(@Query() dto: CalendarQueryDto, @CurrentUser() user: JwtPayload) {
    return this.reports.getCalendarData(dto.month, dto.year, user);
  }
}
