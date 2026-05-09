"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getLearningData() {
  const user = await requireAuth();
  if (!user.employeeId) {
    return { enrollments: [], certifications: [], allCourses: [] };
  }

  const [enrollments, certifications, allCourses] = await Promise.all([
    db.courseEnrollment.findMany({
      where: { employeeId: user.employeeId },
      include: { course: true },
      orderBy: { enrolledAt: "desc" },
    }),
    db.employeeCertification.findMany({
      where: { employeeId: user.employeeId },
      orderBy: { earnedAt: "desc" },
    }),
    db.course.findMany({
      where: { orgId: user.orgId, isActive: true },
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return { enrollments, certifications, allCourses };
}

export async function enrollInCourse(courseId: string) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  await db.courseEnrollment.upsert({
    where: { courseId_employeeId: { courseId, employeeId: user.employeeId } },
    create: { courseId, employeeId: user.employeeId, progress: 0 },
    update: {},
  });

  revalidatePath("/learning");
  revalidatePath("/learning/courses");
}

export async function updateCourseProgress(enrollmentId: string, progress: number) {
  const user = await requireAuth();
  if (!user.employeeId) throw new Error("No employee profile");

  await db.courseEnrollment.update({
    where: { id: enrollmentId },
    data: {
      progress,
      completedAt: progress >= 100 ? new Date() : null,
    },
  });

  revalidatePath("/learning");
}

export async function getOrgLearningStats() {
  const user = await requireAuth();

  const [totalEnrollments, completedEnrollments, certCount] = await Promise.all([
    db.courseEnrollment.count({
      where: { employee: { orgId: user.orgId } },
    }),
    db.courseEnrollment.count({
      where: {
        employee: { orgId: user.orgId },
        completedAt: { not: null },
      },
    }),
    db.employeeCertification.count({
      where: { employee: { orgId: user.orgId } },
    }),
  ]);

  const completionRate = totalEnrollments > 0
    ? Math.round((completedEnrollments / totalEnrollments) * 100)
    : 0;

  return { totalEnrollments, completedEnrollments, certCount, completionRate };
}
