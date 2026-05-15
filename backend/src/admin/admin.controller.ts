import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
  private readonly admin: AdminService;
  constructor(admin: AdminService) { this.admin = admin; }

  @Get('users')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getOrgUsers(@CurrentUser() user: JwtPayload) {
    return this.admin.getOrgUsers(user);
  }

  @Patch('users/role')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  updateUserRole(
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.admin.updateUserRole(dto, user, extractIp(req));
  }

  @Patch('users/:id/toggle-active')
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  toggleUserActive(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.admin.toggleUserActive(id, user, extractIp(req));
  }

  @Get('workflows')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  getWorkflows(@CurrentUser() user: JwtPayload) {
    return this.admin.getWorkflows(user);
  }

  @Post('workflows')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  createWorkflow(@Body() dto: CreateWorkflowDto, @CurrentUser() user: JwtPayload) {
    return this.admin.createWorkflow(dto, user);
  }

  @Patch('workflows/:id/toggle')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  toggleWorkflow(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.admin.toggleWorkflow(id, user);
  }

  @Get('security')
  @Throttle({ default: { ttl: 60_000, limit: 15 } })
  getSecuritySettings(@CurrentUser() user: JwtPayload) {
    return this.admin.getSecuritySettings(user);
  }
}
