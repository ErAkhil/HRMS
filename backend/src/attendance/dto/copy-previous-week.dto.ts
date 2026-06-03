import { IsDateString, IsOptional } from 'class-validator';

export class CopyPreviousWeekDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;
}
