import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterOrgDto {
  @IsString()
  @IsNotEmpty()
  orgName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
