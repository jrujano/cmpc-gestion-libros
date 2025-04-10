import {
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
  IsNotEmpty,
  Min,
  Max,
  IsISBN,
  IsUrl,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateBookDto {
  @ApiPropertyOptional({
    description: 'Título del libro',
    example: 'El Principito',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'ISBN del libro',
    example: '978-3-16-148410-0',
  })
  @IsISBN()
  @IsOptional()
  ISBN?: string;

  @ApiPropertyOptional({
    description: 'Descripción del libro',
    example: 'Un cuento poético con filosofía y crítica social',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Precio del libro',
    example: 19.99,
    minimum: 0.01,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Cantidad en stock',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Fecha de publicación',
    example: '1943-04-06',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  publicationDate?: Date;

  @ApiPropertyOptional({
    description: 'ID del género literario',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  genreId?: number;

  @ApiPropertyOptional({
    description: 'ID de la editorial',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  editorialId?: number;

  @ApiPropertyOptional({
    description: 'URL de la portada del libro',
    example: 'https://example.com/book-cover.jpg',
  })
  @IsUrl()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Edición del libro',
    example: '1ra Edición',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  edition?: string;

  @ApiPropertyOptional({
    description: 'Número de páginas',
    example: 120,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  pages?: number;
}
