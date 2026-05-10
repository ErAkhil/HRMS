import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

export interface NotificationItem {
  id: string;
  type: 'leave' | 'task' | 'performance';
  title: string;
  description: string;
  time: string;
  read: boolean;
  href: string;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(user: JwtPayload): Promise<NotificationItem[]> {
    const notifications: NotificationItem[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isManager =
      user.role === 'SUPER_ADMIN' ||
      user.role === 'HR_ADMIN' ||
      user.role === 'MANAGER';

    const [pendingLeaves, overdueTasks, pendingReviews, myLeaveUpdates] =
      await Promise.all([
        isManager
          ? this.prisma.leaveRequest.findMany({
              where: { employee: { orgId: user.orgId }, status: 'PENDING' },
              include: { employee: { select: { firstName: true, lastName: true } } },
              orderBy: { createdAt: 'desc' },
              take: 5,
            })
          : Promise.resolve([]),

        user.employeeId
          ? this.prisma.task.findMany({
              where: {
                orgId: user.orgId,
                assigneeId: user.employeeId,
                dueDate: { lt: today },
                status: { notIn: ['DONE'] },
              },
              orderBy: { dueDate: 'asc' },
              take: 3,
            })
          : Promise.resolve([]),

        user.employeeId
          ? this.prisma.performanceReview.findMany({
              where: {
                revieweeId: user.employeeId,
                reviewee: { orgId: user.orgId },
                status: 'PENDING',
              },
              take: 2,
            })
          : Promise.resolve([]),

        user.employeeId
          ? this.prisma.leaveRequest.findMany({
              where: {
                employeeId: user.employeeId,
                employee: { orgId: user.orgId },
                status: { in: ['APPROVED', 'REJECTED'] },
                updatedAt: { gte: new Date(Date.now() - 7 * 86_400_000) },
              },
              orderBy: { updatedAt: 'desc' },
              take: 3,
            })
          : Promise.resolve([]),
      ]);

    for (const leave of pendingLeaves) {
      notifications.push({
        id: `leave-${leave.id}`,
        type: 'leave',
        title: 'Leave Request Pending',
        description: `${leave.employee.firstName} ${leave.employee.lastName} requested ${leave.leaveType.toLowerCase().replace(/_/g, ' ')} leave`,
        time: this.relativeTime(leave.createdAt),
        read: false,
        href: '/leave/approvals',
      });
    }

    for (const task of overdueTasks) {
      notifications.push({
        id: `task-${task.id}`,
        type: 'task',
        title: 'Task Overdue',
        description: task.title,
        time: task.dueDate ? this.relativeTime(task.dueDate) : 'Past due',
        read: false,
        href: '/tasks',
      });
    }

    for (const review of pendingReviews) {
      notifications.push({
        id: `review-${review.id}`,
        type: 'performance',
        title: 'Review Pending',
        description: `${review.type} — ${review.period}`,
        time: this.relativeTime(review.createdAt),
        read: false,
        href: '/performance/reviews',
      });
    }

    for (const leave of myLeaveUpdates) {
      const approved = leave.status === 'APPROVED';
      notifications.push({
        id: `leave-upd-${leave.id}`,
        type: 'leave',
        title: `Leave ${approved ? 'Approved' : 'Rejected'}`,
        description: `Your ${leave.leaveType.toLowerCase().replace(/_/g, ' ')} leave has been ${leave.status.toLowerCase()}`,
        time: this.relativeTime(leave.updatedAt),
        read: approved,
        href: '/leave',
      });
    }

    return notifications
      .sort((a, b) => (a.read ? 1 : 0) - (b.read ? 1 : 0))
      .slice(0, 10);
  }

  private relativeTime(date: Date): string {
    const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
}
