import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AttendanceService } from './attendance.service';

@Injectable()
export class AttendanceScheduler {
  private readonly logger = new Logger(AttendanceScheduler.name);

  constructor(private readonly attendance: AttendanceService) {}

  @Cron('5 18 * * *')
  async finalizeAttendanceForDay() {
    const result = await this.attendance.runAutoFinalizationForAllOrgs(new Date(), true);
    this.logger.log(
      `Daily attendance finalization completed: orgs=${result.orgCount}, absent=${result.createdAbsent}, onLeaveCreated=${result.createdOnLeave}, onLeaveUpdated=${result.updatedOnLeave}`,
    );
  }
}
