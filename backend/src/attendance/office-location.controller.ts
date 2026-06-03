import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import { OfficeLocationService } from './office-location.service';
import {
  CreateOfficeLocationDto,
  UpdateOfficeLocationDto,
  OfficeLocationResponseDto,
} from './dto/office-location.dto';

@Controller('attendance/office-locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HR_ADMIN', 'SUPER_ADMIN')
export class OfficeLocationController {
  constructor(private readonly officeLocationService: OfficeLocationService) {}

  @Get()
  async getOfficeLocations(@CurrentUser() user: JwtPayload): Promise<OfficeLocationResponseDto[]> {
    return this.officeLocationService.getOfficeLocations(user.orgId);
  }

  @Get(':id')
  async getOfficeLocation(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<OfficeLocationResponseDto> {
    return this.officeLocationService.getOfficeLocation(id, user.orgId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOfficeLocation(
    @Body() dto: CreateOfficeLocationDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<OfficeLocationResponseDto> {
    return this.officeLocationService.createOfficeLocation(user.orgId, dto);
  }

  @Patch(':id')
  async updateOfficeLocation(
    @Param('id') id: string,
    @Body() dto: UpdateOfficeLocationDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<OfficeLocationResponseDto> {
    return this.officeLocationService.updateOfficeLocation(id, user.orgId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOfficeLocation(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    await this.officeLocationService.deleteOfficeLocation(id, user.orgId);
  }
}
