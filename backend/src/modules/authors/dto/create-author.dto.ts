import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Gabriel García Márquez' })
  @IsString()
  name: string;

  @ApiProperty({ required: false, example: 'Escritor colombiano...' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiProperty({ required: false, example: 'Colombiano' })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ required: false, example: '1927-03-06' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ required: false, example: '2014-04-17' })
  @IsDateString()
  @IsOptional()
  deathDate?: string;
}
