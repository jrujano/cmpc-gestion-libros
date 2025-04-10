import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAuthorDto {
  @ApiPropertyOptional({ example: 'Gabriel García Márquez' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Escritor colombiano...' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ example: 'Colombiano' })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiPropertyOptional({ example: '1927-03-06' })
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ example: '2014-04-17' })
  @IsDateString()
  @IsOptional()
  deathDate?: Date;
}
