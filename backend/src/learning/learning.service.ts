import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Injectable()
export class LearningService {
  constructor(private prisma: PrismaService) {}

  async getLearningData(user: JwtPayload) {
    if (!user.employeeId) return { enrollments: [], certifications: [], allCourses: [] };

    const [enrollments, certifications, allCourses] = await Promise.all([
      this.prisma.courseEnrollment.findMany({
        where: { employeeId: user.employeeId },
        include: { course: true },
        orderBy: { enrolledAt: 'desc' },
      }),
      this.prisma.employeeCertification.findMany({
        where: { employeeId: user.employeeId },
        orderBy: { earnedAt: 'desc' },
      }),
      this.prisma.course.findMany({
        where: { orgId: user.orgId, isActive: true },
        include: { _count: { select: { enrollments: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return { enrollments, certifications, allCourses };
  }

  async enroll(courseId: string, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    await this.prisma.courseEnrollment.upsert({
      where: { courseId_employeeId: { courseId, employeeId: user.employeeId } },
      create: { courseId, employeeId: user.employeeId, progress: 0 },
      update: {},
    });
    return { success: true };
  }

  async updateProgress(enrollmentId: string, progress: number, user: JwtPayload) {
    if (!user.employeeId) throw new BadRequestException('No employee profile');
    await this.prisma.courseEnrollment.update({
      where: { id: enrollmentId },
      data: { progress, completedAt: progress >= 100 ? new Date() : null },
    });
    return { success: true };
  }

  async getOrgStats(user: JwtPayload) {
    const [totalEnrollments, completedEnrollments, certCount] = await Promise.all([
      this.prisma.courseEnrollment.count({ where: { employee: { orgId: user.orgId } } }),
      this.prisma.courseEnrollment.count({ where: { employee: { orgId: user.orgId }, completedAt: { not: null } } }),
      this.prisma.employeeCertification.count({ where: { employee: { orgId: user.orgId } } }),
    ]);

    return {
      totalEnrollments, completedEnrollments, certCount,
      completionRate: totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0,
    };
  }
}
