import { Body, Controller, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { ShiftSchedulingService } from './shift-scheduling.service';
import { ShiftWeekQueryDto } from './dto/shift-week-query.dto';
import { UpsertShiftAssignmentDto } from './dto/upsert-shift-assignment.dto';
import { ClearShiftAssignmentDto } from './dto/clear-shift-assignment.dto';
import { BulkAssignShiftsDto } from './dto/bulk-assign-shifts.dto';
import { CopyPreviousWeekDto } from './dto/copy-previous-week.dto';

@Controller('attendance/shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShiftSchedulingController {
  constructor(private readonly shifts: ShiftSchedulingService) {}

  @Get('week')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  getWeekSchedule(@CurrentUser() user: JwtPayload, @Query() query: ShiftWeekQueryDto) {
    return this.shifts.getOrgWeekSchedule(user, query.startDate);
  }

  @Get('me/week')
  getMyWeekSchedule(@CurrentUser() user: JwtPayload, @Query() query: ShiftWeekQueryDto) {
    return this.shifts.getMyWeekSchedule(user, query.startDate);
  }

  @Patch('assignment')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  upsertShiftAssignment(@CurrentUser() user: JwtPayload, @Body() dto: UpsertShiftAssignmentDto) {
    return this.shifts.upsertShiftAssignment(user, dto);
  }

  @Post('assignment/clear')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  clearShiftAssignment(@CurrentUser() user: JwtPayload, @Body() dto: ClearShiftAssignmentDto) {
    return this.shifts.clearShiftAssignment(user, dto);
  }

  @Post('bulk-assignment')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  bulkAssignShifts(@CurrentUser() user: JwtPayload, @Body() dto: BulkAssignShiftsDto) {
    return this.shifts.bulkAssignShifts(user, dto);
  }

  @Post('copy-previous-week')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  copyPreviousWeek(@CurrentUser() user: JwtPayload, @Body() dto: CopyPreviousWeekDto) {
    return this.shifts.copyPreviousWeekSchedule(user, dto);
  }
}
