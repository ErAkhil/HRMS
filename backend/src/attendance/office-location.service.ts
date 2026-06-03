import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOfficeLocationDto,
  UpdateOfficeLocationDto,
  OfficeLocationResponseDto,
} from './dto/office-location.dto';

@Injectable()
export class OfficeLocationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOfficeLocations(orgId: string): Promise<OfficeLocationResponseDto[]> {
    return this.prisma.officeLocation.findMany({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOfficeLocation(id: string, orgId: string): Promise<OfficeLocationResponseDto> {
    const location = await this.prisma.officeLocation.findUnique({
      where: { id },
    });

    if (!location || location.orgId !== orgId) {
      throw new NotFoundException('Office location not found');
    }

    return location;
  }

  async createOfficeLocation(
    orgId: string,
    dto: CreateOfficeLocationDto,
  ): Promise<OfficeLocationResponseDto> {
    // Check for duplicate office name
    const existing = await this.prisma.officeLocation.findFirst({
      where: { orgId, name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Office location with this name already exists');
    }

    return this.prisma.officeLocation.create({
      data: {
        orgId,
        name: dto.name,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        radiusMeters: dto.radiusMeters ?? 500,
        isActive: true,
      },
    });
  }

  async updateOfficeLocation(
    id: string,
    orgId: string,
    dto: UpdateOfficeLocationDto,
  ): Promise<OfficeLocationResponseDto> {
    const location = await this.prisma.officeLocation.findUnique({
      where: { id },
    });

    if (!location || location.orgId !== orgId) {
      throw new NotFoundException('Office location not found');
    }

    // If updating name, check for duplicates
    if (dto.name && dto.name !== location.name) {
      const existing = await this.prisma.officeLocation.findFirst({
        where: { orgId, name: dto.name },
      });

      if (existing) {
        throw new BadRequestException('Office location with this name already exists');
      }
    }

    return this.prisma.officeLocation.update({
      where: { id },
      data: {
        name: dto.name ?? location.name,
        address: dto.address ?? location.address,
        latitude: dto.latitude ?? location.latitude,
        longitude: dto.longitude ?? location.longitude,
        radiusMeters: dto.radiusMeters ?? location.radiusMeters,
        isActive: dto.isActive ?? location.isActive,
      },
    });
  }

  async deleteOfficeLocation(id: string, orgId: string): Promise<void> {
    const location = await this.prisma.officeLocation.findUnique({
      where: { id },
    });

    if (!location || location.orgId !== orgId) {
      throw new NotFoundException('Office location not found');
    }

    await this.prisma.officeLocation.delete({
      where: { id },
    });
  }
}
