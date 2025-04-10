import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../books.service';
import { getModelToken } from '@nestjs/sequelize';
import { Book } from '../models/book.model';
import { BookAuthor } from '../models/book-author.model';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Genre } from '../../genres/models/genre.model';
import { Editorial } from '../../editorials/models/editorial.model';
import { Logger } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let bookModel: typeof Book;
  let bookAuthorModel: typeof BookAuthor;
  let sequelize: Sequelize;
  let logger: Logger;

  // Mock para transacción
  const mockTransaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  };

  // Mock para Book
  const mockBook = {
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
    update: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
    toJSON: jest.fn().mockReturnValue({}),
  };

  // Mock para Logger
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: Logger,
          useValue: mockLogger,
        },
        {
          provide: getModelToken(Book),
          useValue: {
            create: jest.fn().mockResolvedValue(mockBook),
            findAll: jest.fn().mockResolvedValue([mockBook]),
            findByPk: jest.fn().mockResolvedValue(mockBook),
            findOne: jest.fn().mockResolvedValue(null),
            findAndCountAll: jest
              .fn()
              .mockResolvedValue({ rows: [mockBook], count: 1 }),
            scope: jest.fn().mockReturnThis(),
            restore: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue([1, [mockBook]]),
          },
        },
        {
          provide: getModelToken(BookAuthor),
          useValue: {
            bulkCreate: jest.fn().mockResolvedValue([{}]),
          },
        },
        {
          provide: 'SEQUELIZE',
          useValue: {
            transaction: jest.fn().mockResolvedValue(mockTransaction),
            literal: jest.fn().mockImplementation((str) => str),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookModel = module.get<typeof Book>(getModelToken(Book));
    bookAuthorModel = module.get<typeof BookAuthor>(getModelToken(BookAuthor));
    sequelize = module.get<Sequelize>('SEQUELIZE');
    logger = module.get<Logger>(Logger);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
    mockTransaction.commit.mockClear();
    mockTransaction.rollback.mockClear();
    mockLogger.log.mockClear();
    mockLogger.error.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBookDto: CreateBookDto = {
      title: 'Test Book',
      ISBN: '1234567890',
      description: 'Test Description',
      price: 100,
      stock: 10,
      publicationDate: new Date(),
      genreId: 1,
      editorialId: 1,
      authorIds: [1, 2],
    };

    it('should create a book successfully', async () => {
      const result = await service.create(createBookDto);

      expect(result).toEqual(mockBook);
      expect(bookModel.findOne).toHaveBeenCalledWith({
        where: { ISBN: createBookDto.ISBN },
        transaction: mockTransaction,
      });
      expect(bookModel.create).toHaveBeenCalledWith(
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
        { transaction: mockTransaction },
      );
      expect(bookAuthorModel.bulkCreate).toHaveBeenCalledWith(
        [
          { bookId: mockBook.id, authorId: 1, authorRole: 'Co-autor' },
          { bookId: mockBook.id, authorId: 2, authorRole: 'Co-autor' },
        ],
        { transaction: mockTransaction },
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        'Creating a new book',
        expect.objectContaining({ title: 'Test Book' }),
      );
    });

    it('should throw ConflictException if ISBN already exists', async () => {
      (bookModel.findOne as jest.Mock).mockResolvedValueOnce(mockBook);

      await expect(service.create(createBookDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should rollback transaction on database error', async () => {
      (bookModel.create as jest.Mock).mockRejectedValueOnce(
        new Error('DB Error'),
      );

      await expect(service.create(createBookDto)).rejects.toThrow('DB Error');
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'Error while creating a book',
        expect.objectContaining({ error: expect.any(Error) }),
      );
    });

    it('should work when no authors are provided', async () => {
      const dtoWithoutAuthors = { ...createBookDto, authorIds: undefined };
      const result = await service.create(dtoWithoutAuthors);

      expect(result).toEqual(mockBook);
      expect(bookAuthorModel.bulkCreate).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const result = await service.findAll(1, 10);

      expect(result.data).toEqual([mockBook]);
      expect(result.total).toBe(1);
      expect(bookModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 0,
          include: expect.arrayContaining([
            expect.objectContaining({ model: Genre, as: 'genre' }),
            expect.objectContaining({ model: Editorial, as: 'editorial' }),
          ]),
        }),
      );
    });

    it('should search books by title or ISBN', async () => {
      await service.findAll(1, 10, 'search term');

      expect(bookModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [expect.any(Symbol)]: [
              { title: { [expect.any(Symbol)]: '%search term%' } },
              { ISBN: { [expect.any(Symbol)]: '%search term%' } },
            ],
          },
        }),
      );
    });

    it('should include deleted books when requested', async () => {
      await service.findAll(1, 10, undefined, true);

      expect(bookModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          paranoid: false,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockBook);
      expect(bookModel.findByPk).toHaveBeenCalledWith(1, {
        include: ['genre', 'editorial'],
      });
      expect(logger.log).toHaveBeenCalledWith(`Buscando libro Id: 1`);
    });

    it('should throw NotFoundException if book not found', async () => {
      (bookModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should include deleted books when requested', async () => {
      await service.findOne(1, true);

      expect(bookModel.findByPk).toHaveBeenCalledWith(1, {
        include: ['genre', 'editorial'],
        paranoid: false,
      });
    });
  });

  describe('findAllDeleted', () => {
    it('should return all deleted books', async () => {
      const result = await service.findAllDeleted();

      expect(result).toEqual([mockBook]);
      expect(bookModel.scope).toHaveBeenCalledWith('deleted');
      expect(bookModel.scope('deleted').findAll).toHaveBeenCalledWith({
        include: expect.arrayContaining([
          expect.objectContaining({
            association: 'genre',
            attributes: ['id', 'name'],
          }),
          expect.objectContaining({
            association: 'editorial',
            attributes: ['id', 'name'],
          }),
        ]),
        paranoid: false,
      });
    });
  });

  describe('update', () => {
    const updateBookDto: UpdateBookDto = {
      title: 'Updated Book',
      price: 150,
    };

    it('should update a book', async () => {
      const result = await service.update(1, updateBookDto);

      expect(result).toEqual(mockBook);
      expect(bookModel.findByPk).toHaveBeenCalledWith(1, {
        transaction: mockTransaction,
      });
      expect(mockBook.update).toHaveBeenCalledWith(updateBookDto, {
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw NotFoundException if book not found', async () => {
      (bookModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.update(999, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      (mockBook.update as jest.Mock).mockRejectedValueOnce(
        new Error('Update Error'),
      );

      await expect(service.update(1, updateBookDto)).rejects.toThrow(
        'Update Error',
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted book', async () => {
      await service.restore(1);

      expect(bookModel.restore).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('updateStock', () => {
    it('should update book stock', async () => {
      await service.updateStock(1, 5);

      expect(bookModel.update).toHaveBeenCalledWith(
        { stock: expect.any(String) },
        { where: { id: 1 } },
      );
      expect(sequelize.literal).toHaveBeenCalledWith('stock + 5');
    });
  });
});
