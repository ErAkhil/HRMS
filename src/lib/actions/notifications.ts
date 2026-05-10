"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export type NotificationItem = {
  id: string;
  type: "leave" | "task" | "performance" | "onboarding" | "payroll";
  title: string;
  description: string;
  time: string;
  read: boolean;
  href: string;
};

export async function getNotifications(): Promise<NotificationItem[]> {
  const user = await requireAuth();
  const notifications: NotificationItem[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.role === "SUPER_ADMIN" || user.role === "HR_ADMIN" || user.role === "MANAGER") {
    const pendingLeaves = await db.leaveRequest.findMany({
      where: {
        employee: { orgId: user.orgId },
        status: "PENDING",
      },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    for (const leave of pendingLeaves) {
      notifications.push({
        id: `leave-${leave.id}`,
        type: "leave",
        title: "Leave Request Pending",
        description: `${leave.employee.firstName} ${leave.employee.lastName} requested ${leave.leaveType.toLowerCase()} leave`,
        time: formatRelativeTime(leave.createdAt),
        read: false,
        href: "/leave/approvals",
      });
    }
  }

  if (user.employeeId) {
    const overdueTasks = await db.task.findMany({
      where: {
        orgId: user.orgId,
        assigneeId: user.employeeId,
        dueDate: { lt: today },
        status: { notIn: ["DONE"] },
      },
      orderBy: { dueDate: "asc" },
      take: 3,
    });

    for (const task of overdueTasks) {
      notifications.push({
        id: `task-${task.id}`,
        type: "task",
        title: "Task Overdue",
        description: task.title,
        time: task.dueDate ? formatRelativeTime(task.dueDate) : "Past due",
        read: false,
        href: "/tasks",
      });
    }

    const pendingReviews = await db.performanceReview.findMany({
      where: {
        revieweeId: user.employeeId,
        reviewee: { orgId: user.orgId },
        status: "PENDING",
      },
      take: 2,
    });

    for (const review of pendingReviews) {
      notifications.push({
        id: `review-${review.id}`,
        type: "performance",
        title: "Review Pending",
        description: `${review.type} — ${review.period}`,
        time: formatRelativeTime(review.createdAt),
        read: false,
        href: "/performance/reviews",
      });
    }

    const myLeaveUpdates = await db.leaveRequest.findMany({
      where: {
        employeeId: user.employeeId,
        employee: { orgId: user.orgId },
        status: { in: ["APPROVED", "REJECTED"] },
        updatedAt: { gte: new Date(Date.now() - 7 * 86_400_000) },
      },
      orderBy: { updatedAt: "desc" },
      take: 3,
    });

    for (const leave of myLeaveUpdates) {
      notifications.push({
        id: `leave-upd-${leave.id}`,
        type: "leave",
        title: `Leave ${leave.status === "APPROVED" ? "Approved" : "Rejected"}`,
        description: `Your ${leave.leaveType.toLowerCase()} leave has been ${leave.status.toLowerCase()}`,
        time: formatRelativeTime(leave.updatedAt),
        read: leave.status === "APPROVED",
        href: "/leave",
      });
    }
  }

  return notifications.sort((a, b) => (a.read ? 1 : 0) - (b.read ? 1 : 0)).slice(0, 10);
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
