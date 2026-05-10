import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateOnboardingDto {
  @IsString()
  employeeId: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
