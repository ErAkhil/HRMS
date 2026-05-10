import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiContextService } from './ai-context.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('ai-context')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiContextController {
  constructor(private aiContext: AiContextService) {}

  @Get()
  getContext(@CurrentUser() user: JwtPayload) {
    return this.aiContext.getContext(user);
  }

  @Get('insights')
  getInsights(@CurrentUser() user: JwtPayload) {
    return this.aiContext.getInsights(user);
  }
}
