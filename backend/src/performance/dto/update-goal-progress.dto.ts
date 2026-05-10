import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGoalProgressDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;
}
