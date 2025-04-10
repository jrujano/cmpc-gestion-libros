import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import * as fastCsv from 'fast-csv';

@ApiTags('libros')
@ApiBearerAuth('access-token') // Vinculamos con el esquema configurado en Swagger
@UseGuards(JwtAuthGuard) // Protegemos los endpoints con el guard de JWT
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Book successfully created' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }
  // Manejamos paginado y filtrado
  @Get()
  @ApiResponse({ status: 200, description: 'List de libros' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const pageNumber = page ?? 1;
    const pageLimit = limit ?? 100;
    const searchQuery = search || '';
    return this.booksService.findAll(pageNumber, pageLimit, searchQuery);
  }
  @Get('deleted')
  @ApiResponse({ status: 200, description: 'Get all soft deleted books' })
  async findAllDeleted() {
    return this.booksService.findAllDeleted();
  }

  @Get('export')
  @ApiResponse({ status: 200, description: 'Export all books' })
  async exportBooksToCsv(@Res() res: Response): Promise<void> {
    const books = await this.booksService.findAll();

    // Configuración del encabezado para descargar el archivo
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=books.csv');

    // Generar el CSV con `fast-csv`
    const csvStream = fastCsv.format({ headers: true });
    books.data.forEach((book) => {
      console.log(book);
      csvStream.write({
        ID: book.id,
        Título: book.title,
        ISBN: book.ISBN,
        Descripción: book.description,
        Precio: book.price,
        Stock: book.stock,
        'Fecha de Publicación': book.publicationDate?.toISOString(),
        'ID Género': book.genreId,
        'ID Editorial': book.editorialId,
      });
    });

    csvStream.pipe(res); // Envía el CSV como respuesta
    csvStream.end(); // Finaliza la escritura
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Book updated' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @Post(':id/restore')
  @ApiResponse({ status: 200, description: 'Book restored successfully' })
  async restore(@Param('id') id: string) {
    await this.booksService.restore(+id);
  }
}
