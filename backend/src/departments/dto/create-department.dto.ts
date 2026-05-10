import { IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Invalid color hex code' })
  color?: string;

  @IsOptional()
  @IsString()
  headId?: string;
}
