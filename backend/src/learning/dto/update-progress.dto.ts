import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProgressDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progress: number;
}
