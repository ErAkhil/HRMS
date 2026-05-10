import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SearchQueryDto } from './dto/search-query.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SearchController {
  constructor(private search: SearchService) {}

  @Get()
  globalSearch(@Query() dto: SearchQueryDto, @CurrentUser() user: JwtPayload) {
    return this.search.globalSearch(dto.q, user);
  }
}
