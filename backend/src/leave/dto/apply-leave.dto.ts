import { IsEnum, IsString, IsDateString, MinLength } from 'class-validator';
import { LeaveType } from '@prisma/client';

export class ApplyLeaveDto {
  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @MinLength(5)
  reason: string;
}
