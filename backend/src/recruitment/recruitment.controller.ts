import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AddCandidateDto } from './dto/add-candidate.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('recruitment')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR_ADMIN', 'SUPER_ADMIN', 'MANAGER')
export class RecruitmentController {
  constructor(private recruitment: RecruitmentService) {}

  @Get('jobs')
  getJobPostings(@CurrentUser() user: JwtPayload) {
    return this.recruitment.getJobPostings(user);
  }

  @Get('candidates')
  getCandidates(@CurrentUser() user: JwtPayload, @Query('jobId') jobId?: string) {
    return this.recruitment.getCandidates(user, jobId);
  }

  @Post('candidates')
  addCandidate(@Body() dto: AddCandidateDto, @CurrentUser() user: JwtPayload) {
    return this.recruitment.addCandidate(dto, user);
  }

  @Patch('candidates/:id/stage')
  updateStage(
    @Param('id') id: string,
    @Body() dto: UpdateStageDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.recruitment.updateStage(id, dto.stage, user);
  }
}
