import { IsString, IsInt, IsPositive, IsOptional, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMeetingDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  durationMins: number;

  @IsString()
  platform: string;

  @IsOptional()
  @IsString()
  agenda?: string;

  @IsArray()
  @IsString({ each: true })
  participantIds: string[];
}
