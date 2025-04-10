import { IsString, IsOptional, IsDateString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEditorialDto {
  @ApiPropertyOptional({ example: 'Editorial Planeta' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Calle Falsa 123' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'contacto@planeta.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '1949-01-01' })
  @IsDateString()
  @IsOptional()
  foundationDate?: string;

  @ApiPropertyOptional({ example: 'https://www.planeta.es' })
  @IsString()
  @IsOptional()
  website?: string;
}
