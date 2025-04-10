import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Título del libro',
    example: 'El Principito',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Código ISBN del libro',
    required: false,
    example: '978-987-1234567',
  })
  @IsString()
  @IsOptional()
  ISBN?: string;

  @ApiProperty({
    description: 'Descripción del libro',
    required: false,
    example:
      'Un clásico de la literatura que aborda temas profundos a través de una narrativa infantil.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Precio del libro en la moneda definida',
    example: 19.99,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Cantidad de stock disponible',
    required: false,
    example: 100,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Fecha de publicación del libro',
    required: false,
    example: '2025-04-01',
  })
  @IsDate()
  @IsOptional()
  publicationDate?: Date;

  @ApiProperty({
    description: 'ID del género al que pertenece el libro',
    example: 1,
  })
  @IsNumber()
  genreId: number;

  @ApiProperty({
    description: 'ID de la editorial que publicó el libro',
    example: 2,
  })
  @IsNumber()
  editorialId: number;

  @ApiProperty({
    description: 'URL de la imagen de portada del libro',
    required: false,
    example: 'https://example.com/cover.jpg',
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({
    description: 'Edición del libro',
    required: false,
    example: 'Primera edición',
  })
  @IsString()
  @IsOptional()
  edition?: string;

  @ApiProperty({
    description: 'Número de páginas del libro',
    required: false,
    example: 256,
  })
  @IsNumber()
  @IsOptional()
  pages?: number;

  @ApiProperty({
    description: 'IDs de los autores asociados al libro',
    example: [1, 2, 3], // Ejemplo de IDs
  })
  @IsNumber({}, { each: true }) // Define como un array de números
  @IsOptional()
  authorIds?: number[];
}
