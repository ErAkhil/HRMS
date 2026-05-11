"use server";

import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

export type Enrollment = {
  id: string;
  courseId: string;
  progress: number;
  completedAt: string | null;
  enrolledAt: string;
  course: { title: string; category: string; duration: string };
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  earnedAt: string;
  expiresAt: string | null;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  _count: { enrollments: number };
};

export type LearningData = {
  enrollments: Enrollment[];
  certifications: Certification[];
  allCourses: Course[];
};

export async function getLearningData(): Promise<LearningData> {
  await requireAuth();
  return api.get<LearningData>("/learning");
}

export async function getOrgLearningStats() {
  await requireAuth();
  return api.get<{
    totalEnrollments: number;
    completedEnrollments: number;
    certCount: number;
    completionRate: number;
  }>("/learning/stats");
}

export async function enrollInCourse(courseId: string) {
  await requireAuth();
  await api.post<unknown>("/learning/enroll", { courseId });
  revalidatePath("/learning");
  revalidatePath("/learning/courses");
}

export async function updateCourseProgress(enrollmentId: string, progress: number) {
  await requireAuth();
  await api.patch<unknown>(`/learning/progress/${enrollmentId}`, { progress });
  revalidatePath("/learning");
}
