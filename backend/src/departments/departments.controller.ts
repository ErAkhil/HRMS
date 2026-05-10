import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { DepartmentsService } from './departments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { extractIp } from '../common/utils/extract-ip';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private departments: DepartmentsService) {}

  @Get()
  getAll(@CurrentUser() user: JwtPayload) {
    return this.departments.getAll(user);
  }

  @Get(':id')
  getWithEmployees(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.departments.getWithEmployees(id, user);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'HR_ADMIN')
  create(
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.departments.create(dto, user, extractIp(req));
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'HR_ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: CreateDepartmentDto,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.departments.update(id, dto, user, extractIp(req));
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'HR_ADMIN')
  delete(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    return this.departments.delete(id, user, extractIp(req));
  }
}
