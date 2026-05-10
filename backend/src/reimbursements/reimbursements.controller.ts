import { Controller, Get, Post, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ReimbursementsService } from './reimbursements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SubmitClaimDto } from './dto/submit-claim.dto';
import { extractIp } from '../common/utils/extract-ip';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('reimbursements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReimbursementsController {
  constructor(private reimbursements: ReimbursementsService) {}

  @Get()
  getClaims(@Query('status') status: string | undefined, @CurrentUser() user: JwtPayload) {
    return this.reimbursements.getClaims(status, user);
  }

  @Post()
  submitClaim(@Body() dto: SubmitClaimDto, @CurrentUser() user: JwtPayload) {
    return this.reimbursements.submitClaim(dto, user);
  }

  @Patch(':id/approve')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  approveClaim(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.reimbursements.approveClaim(id, user, extractIp(req));
  }

  @Patch(':id/reject')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  rejectClaim(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.reimbursements.rejectClaim(id, user, extractIp(req));
  }
}
