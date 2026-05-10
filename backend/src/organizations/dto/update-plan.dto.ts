import { IsString, IsEnum } from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  orgId: string;

  @IsEnum(['BASIC', 'PRO', 'PRO_PLUS', 'PRO_MAX'])
  plan: 'BASIC' | 'PRO' | 'PRO_PLUS' | 'PRO_MAX';
}
