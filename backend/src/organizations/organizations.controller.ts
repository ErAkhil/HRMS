import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { extractIp } from '../common/utils/extract-ip';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class OrganizationsController {
  constructor(private orgs: OrganizationsService) {}

  @Get()
  getAll() {
    return this.orgs.getAll();
  }

  @Post()
  create(
    @Body() dto: CreateOrgDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.orgs.create(dto, user, extractIp(req));
  }

  @Patch('plan')
  updatePlan(
    @Body() dto: UpdatePlanDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.orgs.updatePlan(dto, user, extractIp(req));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.orgs.delete(id, user);
  }
}
