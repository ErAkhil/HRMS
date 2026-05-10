import { IsString, IsEnum } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  userId: string;

  @IsEnum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE'])
  role: 'SUPER_ADMIN' | 'HR_ADMIN' | 'MANAGER' | 'EMPLOYEE';
}
