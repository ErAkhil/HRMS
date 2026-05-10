import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateWorkflowDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @MinLength(2)
  trigger: string;
}
