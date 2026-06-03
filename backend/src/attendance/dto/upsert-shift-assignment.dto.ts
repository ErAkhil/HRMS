import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SHIFT_TYPES, type ShiftType } from '../shift-types';

export class UpsertShiftAssignmentDto {
  @IsString()
  employeeId!: string;

  @IsDateString()
  date!: string;

  @IsEnum(SHIFT_TYPES)
  shiftType!: ShiftType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}
