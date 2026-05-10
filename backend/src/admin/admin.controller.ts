import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { extractIp } from '../common/utils/extract-ip';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR_ADMIN', 'SUPER_ADMIN')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('users')
  getOrgUsers(@CurrentUser() user: JwtPayload) {
    return this.admin.getOrgUsers(user);
  }

  @Patch('users/role')
  updateUserRole(
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.admin.updateUserRole(dto, user, extractIp(req));
  }

  @Patch('users/:id/toggle-active')
  toggleUserActive(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.admin.toggleUserActive(id, user, extractIp(req));
  }

  @Get('workflows')
  getWorkflows(@CurrentUser() user: JwtPayload) {
    return this.admin.getWorkflows(user);
  }

  @Post('workflows')
  createWorkflow(@Body() dto: CreateWorkflowDto, @CurrentUser() user: JwtPayload) {
    return this.admin.createWorkflow(dto, user);
  }

  @Patch('workflows/:id/toggle')
  toggleWorkflow(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.admin.toggleWorkflow(id, user);
  }

  @Get('security')
  getSecuritySettings(@CurrentUser() user: JwtPayload) {
    return this.admin.getSecuritySettings(user);
  }
}
