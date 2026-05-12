import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReviewCycleDto {
  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
