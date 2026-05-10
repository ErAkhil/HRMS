import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeaveModule } from './leave/leave.module';
import { TasksModule } from './tasks/tasks.module';
import { MeetingsModule } from './meetings/meetings.module';
import { PayrollModule } from './payroll/payroll.module';
import { PerformanceModule } from './performance/performance.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { LearningModule } from './learning/learning.module';
import { EventsModule } from './events/events.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';
import { CelebrationsModule } from './celebrations/celebrations.module';
import { AdminModule } from './admin/admin.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DepartmentsModule } from './departments/departments.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ReimbursementsModule } from './reimbursements/reimbursements.module';
import { AiContextModule } from './ai-context/ai-context.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EventsModule,
    AuditModule,
    AuthModule,
    EmployeesModule,
    AttendanceModule,
    LeaveModule,
    TasksModule,
    MeetingsModule,
    PayrollModule,
    PerformanceModule,
    RecruitmentModule,
    LearningModule,
    NotificationsModule,
    SearchModule,
    DashboardModule,
    ReportsModule,
    CelebrationsModule,
    AdminModule,
    OrganizationsModule,
    DepartmentsModule,
    CollaborationModule,
    OnboardingModule,
    ReimbursementsModule,
    AiContextModule,
  ],
})
export class AppModule {}
