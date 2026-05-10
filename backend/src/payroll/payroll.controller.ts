import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RunPayrollDto } from './dto/run-payroll.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private payroll: PayrollService) {}

  @Get('runs')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  getPayrollRuns(@CurrentUser() user: JwtPayload) {
    return this.payroll.getPayrollRuns(user);
  }

  @Get('runs/latest/payslips')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  getLatestRunPayslips(@CurrentUser() user: JwtPayload) {
    return this.payroll.getLatestRunPayslips(user);
  }

  @Get('insights')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  getInsights(@CurrentUser() user: JwtPayload) {
    return this.payroll.getInsights(user);
  }

  @Get('me/payslips')
  getMyPayslips(@CurrentUser() user: JwtPayload) {
    return this.payroll.getMyPayslips(user);
  }

  @Get('payslips/:id')
  getPayslip(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.payroll.getPayslip(id, user);
  }

  @Post('run')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  runPayroll(@Body() dto: RunPayrollDto, @CurrentUser() user: JwtPayload) {
    return this.payroll.runPayroll(dto.month, dto.year, user);
  }
}
