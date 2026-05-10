import { IsEnum, IsNumber, IsPositive, IsString, MinLength, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitClaimDto {
  @IsEnum(['TRAVEL', 'MEALS', 'EQUIPMENT', 'MEDICAL', 'TRAINING', 'OTHER'])
  category: 'TRAVEL' | 'MEALS' | 'EQUIPMENT' | 'MEDICAL' | 'TRAINING' | 'OTHER';

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(5)
  description: string;
}
