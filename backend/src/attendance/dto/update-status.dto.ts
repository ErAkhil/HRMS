import { IsString, IsEnum, IsDateString } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class UpdateAttendanceStatusDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
