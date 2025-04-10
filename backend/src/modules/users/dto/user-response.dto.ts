import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../models/user-role.enum';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 'juan@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @IsOptional()
  createdAt?: Date;
  @IsOptional()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Refresh token del usuario',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsOptional()
  refreshToken?: string;
}
