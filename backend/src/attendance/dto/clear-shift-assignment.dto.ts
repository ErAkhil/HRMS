import { IsDateString, IsString } from 'class-validator';

export class ClearShiftAssignmentDto {
  @IsString()
  employeeId!: string;

  @IsDateString()
  date!: string;
}
