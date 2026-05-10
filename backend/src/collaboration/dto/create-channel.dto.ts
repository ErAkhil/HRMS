import { IsString, MinLength, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
