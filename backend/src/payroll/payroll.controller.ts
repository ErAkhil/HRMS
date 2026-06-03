import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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
  private readonly payroll: PayrollService;
  constructor(payroll: PayrollService) { this.payroll = payroll; }

  @Get('runs')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  getPayrollRuns(@CurrentUser() user: JwtPayload) {
    return this.payroll.getPayrollRuns(user);
  }

  @Get('runs/latest/payslips')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  getLatestRunPayslips(@CurrentUser() user: JwtPayload) {
    return this.payroll.getLatestRunPayslips(user);
  }

  @Get('insights')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  @Throttle({ default: { ttl: 60_000, limit: 15 } })
  getInsights(@CurrentUser() user: JwtPayload) {
    return this.payroll.getInsights(user);
  }

  @Get('me/payslips')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getMyPayslips(@CurrentUser() user: JwtPayload) {
    return this.payroll.getMyPayslips(user);
  }

  @Get('payslips/:id')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getPayslip(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.payroll.getPayslip(id, user);
  }

  @Post('run')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  @Throttle({ default: { ttl: 60_000, limit: 3 } })
  runPayroll(@Body() dto: RunPayrollDto, @CurrentUser() user: JwtPayload) {
    return this.payroll.runPayroll(dto.month, dto.year, user);
  }

  @Get('summary/:year/:month')
  @Roles('HR_ADMIN', 'SUPER_ADMIN')
  @Throttle({ default: { ttl: 60_000, limit: 30 } })
  getPayrollSummaryForMonth(
    @Param('year') year: string,
    @Param('month') month: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.payroll.getPayrollSummaryForMonth(parseInt(month), parseInt(year), user);
  }
}
