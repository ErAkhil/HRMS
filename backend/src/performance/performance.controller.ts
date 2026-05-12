import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { CreateReviewCycleDto } from './dto/create-review-cycle.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('performance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PerformanceController {
  constructor(private performance: PerformanceService) {}

  @Get('goals')
  getMyGoals(@CurrentUser() user: JwtPayload) {
    return this.performance.getMyGoals(user);
  }

  @Post('goals')
  createGoal(@Body() dto: CreateGoalDto, @CurrentUser() user: JwtPayload) {
    return this.performance.createGoal(dto, user);
  }

  @Patch('goals/:id/progress')
  updateGoalProgress(
    @Param('id') id: string,
    @Body() dto: UpdateGoalProgressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.performance.updateGoalProgress(id, dto.progress, user);
  }

  @Post('reviews/self')
  scheduleSelfReview(
    @Body() dto: { type: string; period: string; notes?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.performance.scheduleSelfReview(dto, user);
  }

  @Post('reviews')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  createReviewCycle(@Body() dto: CreateReviewCycleDto, @CurrentUser() user: JwtPayload) {
    return this.performance.createReviewCycle(dto, user);
  }

  @Get('reviews/me')
  getMyReviews(@CurrentUser() user: JwtPayload) {
    return this.performance.getMyReviews(user);
  }

  @Get('reviews/org')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  getOrgReviews(@CurrentUser() user: JwtPayload) {
    return this.performance.getOrgReviews(user);
  }

  @Get('reviews/employee/:id')
  getEmployeeReviews(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.performance.getEmployeeReviews(id, user);
  }

  @Get('analytics')
  @Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
  getAnalytics(@CurrentUser() user: JwtPayload) {
    return this.performance.getAnalytics(user);
  }

  @Get('team-summary')
  getTeamSummary(@CurrentUser() user: JwtPayload) {
    return this.performance.getTeamSummary(user);
  }
}
