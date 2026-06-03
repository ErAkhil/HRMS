import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SHIFT_TYPES, type ShiftType } from '../shift-types';

export class BulkAssignShiftsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  employeeIds!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsDateString({}, { each: true })
  dates!: string[];

  @IsEnum(SHIFT_TYPES)
  shiftType!: ShiftType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  notes?: string;
}
