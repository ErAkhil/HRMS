import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GetAuditLogsDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
