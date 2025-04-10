import { IsString, IsOptional, IsDateString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEditorialDto {
  @ApiProperty({ example: 'Editorial Planeta' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Calle Falsa 123' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, example: 'contacto@planeta.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: '1949-01-01' })
  @IsDateString()
  @IsOptional()
  foundationDate?: string;

  @ApiProperty({ required: false, example: 'https://www.planeta.es' })
  @IsString()
  @IsOptional()
  website?: string;
}
