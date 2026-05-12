import { IsEmail } from 'class-validator';

export class GoogleSignInDto {
  @IsEmail()
  email: string;
}
