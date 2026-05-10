import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';
import type { AddCandidateDto } from './dto/add-candidate.dto';
import type { CandidateStage } from '@prisma/client';

@Injectable()
export class RecruitmentService {
  constructor(private prisma: PrismaService) {}

  async getJobPostings(user: JwtPayload) {
    const rows = await this.prisma.jobPosting.findMany({
      where: { orgId: user.orgId },
      include: { _count: { select: { candidates: true } } },
      orderBy: { postedAt: 'desc' },
    });
    return rows.map((j) => ({
      id: j.id, title: j.title, department: j.department,
      location: j.location, type: j.type, isActive: j.isActive,
      postedAt: j.postedAt.toISOString(),
      candidateCount: j._count.candidates,
    }));
  }

  async getCandidates(user: JwtPayload, jobId?: string) {
    const rows = await this.prisma.candidate.findMany({
      where: { job: { orgId: user.orgId }, ...(jobId ? { jobId } : {}) },
      include: { job: { select: { title: true, department: true } } },
      orderBy: { appliedAt: 'desc' },
    });
    return rows.map((c) => ({
      id: c.id, name: c.name, email: c.email,
      stage: c.stage, source: c.source,
      appliedAt: c.appliedAt.toISOString(),
      jobTitle: c.job?.title ?? 'Unknown',
      jobDepartment: c.job?.department ?? '—',
    }));
  }

  async addCandidate(dto: AddCandidateDto, user: JwtPayload) {
    const job = await this.prisma.jobPosting.findFirst({ where: { id: dto.jobId, orgId: user.orgId } });
    if (!job) throw new NotFoundException('Job posting not found');

    return this.prisma.candidate.create({
      data: { jobId: dto.jobId, name: dto.name, email: dto.email, phone: dto.phone, source: dto.source },
    });
  }

  async updateStage(candidateId: string, stage: CandidateStage, user: JwtPayload) {
    await this.prisma.candidate.updateMany({
      where: { id: candidateId, job: { orgId: user.orgId } },
      data: { stage, updatedAt: new Date() },
    });
    return { success: true };
  }
}
