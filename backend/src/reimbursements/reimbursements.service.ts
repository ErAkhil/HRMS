import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { SubmitClaimDto } from './dto/submit-claim.dto';

@Injectable()
export class ReimbursementsService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getClaims(status: string | undefined, user: JwtPayload) {
    const where: Record<string, unknown> = { employee: { orgId: user.orgId } };

    if (user.role === 'EMPLOYEE' && user.employeeId) {
      where.employeeId = user.employeeId;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    return this.prisma.claim.findMany({
      where,
      include: {
        employee: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitClaim(dto: SubmitClaimDto, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');

    return this.prisma.claim.create({
      data: {
        employeeId: user.employeeId,
        category: dto.category,
        amount: dto.amount,
        date: new Date(dto.date),
        description: dto.description,
      },
    });
  }

  async approveClaim(claimId: string, user: JwtPayload, ipAddress: string) {
    const existing = await this.prisma.claim.findUnique({
      where: { id: claimId },
      select: { id: true, employee: { select: { orgId: true } } },
    });

    if (!existing || existing.employee.orgId !== user.orgId) {
      throw new NotFoundException('Claim not found');
    }

    const claim = await this.prisma.claim.update({
      where: { id: claimId },
      data: { status: 'APPROVED', reviewedBy: user.sub, reviewedAt: new Date() },
    });

    await this.audit.log(user, {
      action: 'claim.approved',
      resource: `Claim ${claimId}`,
      details: `Approved ₹${claim.amount}`,
      ipAddress,
    });

    return claim;
  }

  async rejectClaim(claimId: string, user: JwtPayload, ipAddress: string) {
    const existing = await this.prisma.claim.findUnique({
      where: { id: claimId },
      select: { id: true, employee: { select: { orgId: true } } },
    });

    if (!existing || existing.employee.orgId !== user.orgId) {
      throw new NotFoundException('Claim not found');
    }

    const claim = await this.prisma.claim.update({
      where: { id: claimId },
      data: { status: 'REJECTED', reviewedBy: user.sub, reviewedAt: new Date() },
    });

    await this.audit.log(user, {
      action: 'claim.rejected',
      resource: `Claim ${claimId}`,
      details: `Rejected claim ₹${claim.amount}`,
      ipAddress,
    });

    return claim;
  }
}
