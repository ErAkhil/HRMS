import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { EventsModule } from '../events/events.module';
import { AttendanceScheduler } from './attendance.scheduler';
import { ShiftSchedulingController } from './shift-scheduling.controller';
import { ShiftSchedulingService } from './shift-scheduling.service';
import { GeolocationService } from '../common/services/geolocation.service';
import { OfficeLocationController } from './office-location.controller';
import { OfficeLocationService } from './office-location.service';

@Module({
  imports: [EventsModule],
  providers: [AttendanceService, AttendanceScheduler, ShiftSchedulingService, GeolocationService, OfficeLocationService],
  controllers: [AttendanceController, ShiftSchedulingController, OfficeLocationController],
  exports: [AttendanceService],
})
export class AttendanceModule {}
