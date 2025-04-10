import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '../models/book.model';
import { Genre } from '../../genres/models/genre.model';
import { Editorial } from '../../editorials/models/editorial.model';
import { Author } from '../../authors/models/author.model';
import { Response } from 'express';
import * as fastCsv from 'fast-csv';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  // Mock para Genre
  const mockGenre: Genre = {
    id: 1,
    name: 'Fiction',
    description: 'Fictional works',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    books: [],
    $add: jest.fn(),
    $set: jest.fn(),
    $get: jest.fn(),
    $remove: jest.fn(),
    $create: jest.fn(),
    // ... otras propiedades de Sequelize/TypeORM
  } as unknown as Genre;

  // Mock para Editorial
  const mockEditorial: Editorial = {
    id: 1,
    name: 'Test Editorial',
    address: '123 Test St',
    phone: '1234567890',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    books: [],
    $add: jest.fn(),
    $set: jest.fn(),
    $get: jest.fn(),
    $remove: jest.fn(),
    $create: jest.fn(),
    // ... otras propiedades de Sequelize/TypeORM
  } as unknown as Editorial;

  // Mock para Author
  const mockAuthor: Author = {
    id: 1,
    name: 'Test Author',
    biography: 'Test Biography',
    birthDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    books: [],
    $add: jest.fn(),
    $set: jest.fn(),
    $get: jest.fn(),
    $remove: jest.fn(),
    $create: jest.fn(),
    // ... otras propiedades de Sequelize/TypeORM
  } as unknown as Author;

  // Mock completo para Book
  // Mock completo para Book
  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    ISBN: '1234567890',
    description: 'Test Description',
    price: 100,
    stock: 10,
    publicationDate: new Date(),
    genreId: 1,
    editorialId: 1,
    coverImage: 'cover.jpg',
    edition: '1st',
    pages: 200,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    genre: mockGenre,
    editorial: mockEditorial,
    authors: [mockAuthor],
    $add: jest.fn(),
    $set: jest.fn(),
    $get: jest.fn(),
    $remove: jest.fn(),
    $create: jest.fn(),
    toJSON: function (this: Book) {
      // <-- Añade el tipo de this aquí
      return {
        id: this.id,
        title: this.title,
        ISBN: this.ISBN,
        description: this.description,
        price: this.price,
        stock: this.stock,
        publicationDate: this.publicationDate,
        genreId: this.genreId,
        editorialId: this.editorialId,
        coverImage: this.coverImage,
        edition: this.edition,
        pages: this.pages,
      };
    },
  } as unknown as Book;

  const mockResponse = {
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    pipe: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockBook),
            findAll: jest.fn().mockResolvedValue({
              data: [mockBook],
              meta: {
                total: 1,
                page: 1,
                limit: 10,
                totalPages: 1,
              },
            }),
            findAllDeleted: jest.fn().mockResolvedValue([mockBook]),
            findOne: jest.fn().mockResolvedValue(mockBook),
            update: jest.fn().mockResolvedValue(mockBook),
            remove: jest.fn().mockResolvedValue(undefined),
            restore: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        ISBN: '1234567890',
        description: 'Test Description',
        price: 100,
        stock: 10,
        publicationDate: new Date(),
        genreId: 1,
        editorialId: 1,
      };

      const result = await controller.create(createBookDto);
      expect(result).toEqual(mockBook);
      expect(booksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  // Resto de tus tests...
});
