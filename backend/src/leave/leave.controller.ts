import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApplyLeaveDto } from './dto/apply-leave.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private leave: LeaveService) {}

  @Get('balances')
  getMyBalances(@CurrentUser() user: JwtPayload) {
    return this.leave.getMyBalances(user);
  }

  @Get('requests')
  getRequests(@CurrentUser() user: JwtPayload, @Query('status') status?: string) {
    return this.leave.getRequests(user, status);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: JwtPayload) {
    return this.leave.getSummary(user);
  }

  @Post('requests')
  applyLeave(@Body() dto: ApplyLeaveDto, @CurrentUser() user: JwtPayload) {
    return this.leave.applyLeave(dto, user);
  }

  @Patch('requests/:id/approve')
  approveLeave(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.leave.approveLeave(id, user);
  }

  @Patch('requests/:id/reject')
  rejectLeave(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.leave.rejectLeave(id, user);
  }

  @Patch('requests/:id/cancel')
  cancelLeave(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.leave.cancelLeave(id, user);
  }
}
