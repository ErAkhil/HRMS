import { Controller, Get, UseGuards } from '@nestjs/common';
import { CelebrationsService } from './celebrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('celebrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CelebrationsController {
  constructor(private celebrations: CelebrationsService) {}

  @Get()
  getUpcoming(@CurrentUser() user: JwtPayload) {
    return this.celebrations.getUpcoming(user);
  }
}
