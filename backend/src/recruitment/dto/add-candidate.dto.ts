import { IsString, IsEmail, IsOptional } from 'class-validator';

export class AddCandidateDto {
  @IsString()
  jobId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  source?: string;
}
