import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { LearningService } from './learning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { EnrollDto } from './dto/enroll.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('learning')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LearningController {
  constructor(private learning: LearningService) {}

  @Get()
  getLearningData(@CurrentUser() user: JwtPayload) {
    return this.learning.getLearningData(user);
  }

  @Get('stats')
  getOrgStats(@CurrentUser() user: JwtPayload) {
    return this.learning.getOrgStats(user);
  }

  @Post('enroll')
  enroll(@Body() dto: EnrollDto, @CurrentUser() user: JwtPayload) {
    return this.learning.enroll(dto.courseId, user);
  }

  @Patch('progress/:id')
  updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateProgressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.learning.updateProgress(id, dto.progress, user);
  }
}
