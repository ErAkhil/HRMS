import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendDmDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
