import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('onboarding')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OnboardingController {
  constructor(private onboarding: OnboardingService) {}

  @Get('offboarding/stats')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  getOffboardingStats(@CurrentUser() user: JwtPayload) {
    return this.onboarding.getOffboardingStats(user);
  }

  @Get('offboarding')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  getOffboarding(@CurrentUser() user: JwtPayload) {
    return this.onboarding.getOffboardingRecords(user);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  getRecords(@CurrentUser() user: JwtPayload) {
    return this.onboarding.getRecords(user);
  }

  @Get('stats')
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  getStats(@CurrentUser() user: JwtPayload) {
    return this.onboarding.getStats(user);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'HR_ADMIN', 'MANAGER')
  createOrUpdate(@Body() dto: CreateOnboardingDto, @CurrentUser() user: JwtPayload) {
    return this.onboarding.createOrUpdate(dto, user);
  }
}
