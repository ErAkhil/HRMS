import { Controller, Get, Post, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateAttendanceStatusDto } from './dto/update-status.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}

  @Get('today')
  getTodayAttendance(@CurrentUser() user: JwtPayload) {
    return this.attendance.getTodayAttendance(user);
  }

  @Get('stats')
  getStats(@CurrentUser() user: JwtPayload) {
    return this.attendance.getStats(user);
  }

  @Get('heatmap')
  getHeatmap(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.attendance.getMonthlyHeatmap(Number(month), Number(year), user);
  }

  @Get('dept-report')
  getDeptReport(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.attendance.getDeptReport(Number(month), Number(year), user);
  }

  @Get('me/status')
  getMyStatus(@CurrentUser() user: JwtPayload) {
    return this.attendance.getMyTodayStatus(user);
  }

  @Get('summary')
  getSummary(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.attendance.getSummary(Number(month), Number(year), user);
  }

  @Post('check-in')
  checkIn(@CurrentUser() user: JwtPayload) {
    return this.attendance.checkIn(user);
  }

  @Post('check-out')
  checkOut(@CurrentUser() user: JwtPayload) {
    return this.attendance.checkOut(user);
  }

  @Patch('status')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  updateStatus(@Body() dto: UpdateAttendanceStatusDto) {
    return this.attendance.updateStatus(dto.employeeId, dto.date, dto.status);
  }
}
