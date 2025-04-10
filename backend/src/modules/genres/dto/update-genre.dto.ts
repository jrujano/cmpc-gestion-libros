import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGenreDto {
  @ApiPropertyOptional({ example: 'Ficción' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Obras de imaginación...' })
  @IsString()
  @IsOptional()
  description?: string;
}
