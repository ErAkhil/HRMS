import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CalendarQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(11)
  month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2020)
  year: number;
}
