import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from './models/book.model';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Sequelize } from 'sequelize-typescript';

import { FindAndCountOptions, Op } from 'sequelize';
import { BookAuthor } from './models/book-author.model';
import { Genre } from '../genres/models/genre.model';
import { Editorial } from '../editorials/models/editorial.model';

@Injectable()
export class BooksService {
  // Log de Operaciones
  private readonly logger = new Logger(BooksService.name);
  constructor(
    @InjectModel(Book)
    private readonly bookModel: typeof Book,
    @InjectModel(BookAuthor)
    private readonly bookAuthorModel: typeof BookAuthor,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log('Creating a new book', {
        title: createBookDto.title,
      });

      // Verificar si un libro con el mismo ISBN ya existe
      const existingBook = await this.bookModel.findOne({
        where: { ISBN: createBookDto.ISBN },
      });

      if (existingBook) {
        throw new ConflictException(
          `A book with ISBN "${createBookDto.ISBN}" already exists.`,
        );
      }

      // Crear el libro con transaciones
      const book = await this.bookModel.create(
        {
          title: createBookDto.title,
          ISBN: createBookDto.ISBN,
          description: createBookDto.description,
          price: createBookDto.price,
          stock: createBookDto.stock,
          publicationDate: createBookDto.publicationDate,
          genreId: createBookDto.genreId,
          editorialId: createBookDto.editorialId,
          coverImage: createBookDto.coverImage,
          edition: createBookDto.edition,
          pages: createBookDto.pages,
        },
        { transaction },
      );

      // Insertar relaciones en la tabla book_authors
      if (createBookDto.authorIds && createBookDto.authorIds.length > 0) {
        const bookAuthorEntries = createBookDto.authorIds.map((authorId) => ({
          bookId: book.id,
          authorId,
          authorRole:
            createBookDto.authorIds.length === 1
              ? 'Autor principal'
              : 'Co-autor',
        }));

        await this.bookAuthorModel.bulkCreate(bookAuthorEntries, {
          transaction,
        });
      }

      await transaction.commit(); // Confirmar la transacción
      return book;
    } catch (error) {
      await transaction.rollback(); // Revertir la transacción en caso de error

      if (error instanceof ConflictException) {
        throw error; // Relanzar la excepción para manejarla en el controlador
      }

      this.logger.error('Error while creating a book', { error });
      throw error; // Relanzar cualquier otro error
    }
  }

  async restore(id: number): Promise<void> {
    await this.bookModel.restore({
      where: { id },
    });
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    includeDeleted: boolean = false,
  ): Promise<{ data: Book[]; total: number }> {
    const where = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { ISBN: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const options: FindAndCountOptions = {
      where,
      include: [
        {
          model: Genre,
          as: 'genre', // Usa el mismo alias que definiste en tu relación @BelongsTo
        },
        {
          model: Editorial,
          as: 'editorial',
        },
      ],
      paranoid: !includeDeleted,
      // Eliminamos raw: true para mantener la estructura de objetos anidada
    };

    // Paginación
    if (
      typeof page === 'number' &&
      typeof limit === 'number' &&
      page > 0 &&
      limit > 0
    ) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    const { rows, count } = await this.bookModel.findAndCountAll(options);

    return {
      data: rows,
      total: count,
    };
  }

  async findOne(id: number, includeDeleted: boolean = false): Promise<Book> {
    this.logger.log(`Buscando libro Id: ${id} `);
    const options: any = {
      include: ['genre', 'editorial'],
    };

    if (includeDeleted) {
      options.paranoid = false;
    }

    const book = await this.bookModel.findByPk(id, options);

    if (!book || (!includeDeleted && book.deletedAt !== null)) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async findAllDeleted(): Promise<Book[]> {
    try {
      return await this.bookModel.scope('deleted').findAll({
        include: [
          {
            association: 'genre',
            attributes: ['id', 'name'],
          },
          {
            association: 'editorial',
            attributes: ['id', 'name'],
          },
          {
            association: 'authors',
            through: { attributes: [] }, // Excluye atributos de la tabla intermedia
          },
        ],
        paranoid: false,
      });
    } catch (error) {
      console.error('Error al recuperar libros eliminados:', error);
      throw new Error('No se pudieron recuperar los libros eliminados');
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    this.logger.log(`Actualizando libro ID: ${id}`);

    // Iniciar una transacción
    const transaction = await this.sequelize.transaction();

    try {
      // Buscar el libro existente
      const book = await this.bookModel.findByPk(id, { transaction });
      if (!book) {
        throw new NotFoundException(`El libro con ID ${id} no existe.`);
      }

      // Actualizar el libro dentro de la transacción
      await book.update(updateBookDto, { transaction });

      // Puedes añadir lógica adicional aquí si necesitas actualizar otras tablas relacionadas
      // Por ejemplo, actualizar stock, o validar datos en tablas externas.

      await transaction.commit(); // Confirmar la transacción

      this.logger.log(`Libro ID ${id} actualizado correctamente.`);
      return book;
    } catch (error) {
      await transaction.rollback(); // Revertir la transacción en caso de error
      this.logger.error(`Error al actualizar el libro ID ${id}`, error);
      throw error; // Relanzar el error para manejarlo adecuadamente
    }
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      this.logger.log(`Removiendo libro ID: ${id}`);

      // Buscar el libro dentro de la transacción
      const book = await this.bookModel.findByPk(id, { transaction });
      if (!book) {
        throw new NotFoundException(`El libro con ID ${id} no existe.`);
      }

      // Realizar el soft delete
      await book.destroy({ transaction });

      // Puedes añadir operaciones adicionales aquí, como auditoría o limpiar relaciones
      this.logger.log(`Libro ID ${id} eliminado correctamente.`);

      await transaction.commit(); // Confirmar la transacción
    } catch (error) {
      await transaction.rollback(); // Revertir la transacción en caso de error
      this.logger.error(`Error al remover el libro ID ${id}`, error);
      throw error; // Relanzar el error para manejarlo en niveles superiores
    }
  }

  async updateStock(id: number, quantity: number): Promise<void> {
    await this.bookModel.update(
      { stock: this.sequelize.literal(`stock + ${quantity}`) },
      { where: { id } },
    );
  }
}
