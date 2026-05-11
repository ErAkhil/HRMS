import {
  Controller, Get, Post, Patch, Body, Param,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private employees: EmployeesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.employees.findAll(user);
  }

  @Get('me/profile')
  getMyProfile(@CurrentUser() user: JwtPayload) {
    return this.employees.getMyProfile(user);
  }

  @Get('departments')
  getDepartments(@CurrentUser() user: JwtPayload) {
    return this.employees.getDepartments(user);
  }

  @Get('org-chart')
  getOrgChart(@CurrentUser() user: JwtPayload) {
    return this.employees.getOrgChart(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.employees.findOne(id, user);
  }

  @Post()
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: JwtPayload) {
    return this.employees.create(dto, user);
  }

  @Patch(':id')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employees.update(id, dto, user);
  }

  @Patch(':id/deactivate')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  deactivate(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.employees.deactivate(id, user);
  }
}
