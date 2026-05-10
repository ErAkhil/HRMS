import { Module } from '@nestjs/common';
import { ReimbursementsService } from './reimbursements.service';
import { ReimbursementsController } from './reimbursements.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  providers: [ReimbursementsService],
  controllers: [ReimbursementsController],
})
export class ReimbursementsModule {}
