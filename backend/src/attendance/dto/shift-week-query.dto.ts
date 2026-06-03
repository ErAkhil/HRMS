import { IsDateString, IsOptional } from 'class-validator';

export class ShiftWeekQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
