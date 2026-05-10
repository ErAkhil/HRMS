import { IsString, IsEmail, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateOrgDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be lowercase letters, numbers, and hyphens only' })
  slug: string;

  @IsEnum(['BASIC', 'PRO', 'PRO_PLUS', 'PRO_MAX'])
  plan: 'BASIC' | 'PRO' | 'PRO_PLUS' | 'PRO_MAX';

  @IsEmail()
  adminEmail: string;

  @IsString()
  @MinLength(8)
  adminPassword: string;

  @IsString()
  @MinLength(2)
  adminName: string;
}
