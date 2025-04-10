import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Response } from 'express';
import * as fastCsv from 'fast-csv';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  // Mock para la respuesta HTTP
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
            create: jest.fn(),
            findAll: jest.fn(),
            findAllDeleted: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
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

      const result = { id: 1, ...createBookDto };
      jest.spyOn(booksService, 'create').mockResolvedValue(result);

      expect(await controller.create(createBookDto)).toEqual(result);
      expect(booksService.create).toHaveBeenCalledWith(createBookDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books with default pagination', async () => {
      const mockBooks = {
        data: [
          {
            id: 1,
            title: 'Book 1',
            ISBN: '1234567890',
            description: 'Description 1',
            price: 100,
            stock: 10,
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 100,
          totalPages: 1,
        },
      };

      jest.spyOn(booksService, 'findAll').mockResolvedValue(mockBooks);

      const result = await controller.findAll();
      expect(result).toEqual(mockBooks);
      expect(booksService.findAll).toHaveBeenCalledWith(1, 100, '');
    });

    it('should return paginated books with custom parameters', async () => {
      const mockBooks = {
        data: [
          {
            id: 1,
            title: 'Book 1',
            ISBN: '1234567890',
            description: 'Description 1',
            price: 100,
            stock: 10,
          },
        ],
        meta: {
          total: 1,
          page: 2,
          limit: 20,
          totalPages: 1,
        },
      };

      jest.spyOn(booksService, 'findAll').mockResolvedValue(mockBooks);

      const result = await controller.findAll(2, 20, 'search');
      expect(result).toEqual(mockBooks);
      expect(booksService.findAll).toHaveBeenCalledWith(2, 20, 'search');
    });
  });

  describe('findAllDeleted', () => {
    it('should return all soft deleted books', async () => {
      const mockDeletedBooks = [
        {
          id: 1,
          title: 'Deleted Book',
          ISBN: '1234567890',
          description: 'Deleted Description',
          price: 100,
          stock: 0,
          deletedAt: new Date(),
        },
      ];

      jest
        .spyOn(booksService, 'findAllDeleted')
        .mockResolvedValue(mockDeletedBooks);

      const result = await controller.findAllDeleted();
      expect(result).toEqual(mockDeletedBooks);
      expect(booksService.findAllDeleted).toHaveBeenCalled();
    });
  });

  describe('exportBooksToCsv', () => {
    it('should export books to CSV', async () => {
      const mockBooks = {
        data: [
          {
            id: 1,
            title: 'Book 1',
            ISBN: '1234567890',
            description: 'Description 1',
            price: 100,
            stock: 10,
            publicationDate: new Date('2023-01-01'),
            genreId: 1,
            editorialId: 1,
            toJSON: function () {
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
              };
            },
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 100,
          totalPages: 1,
        },
      };

      jest.spyOn(booksService, 'findAll').mockResolvedValue(mockBooks);
      jest.spyOn(fastCsv, 'format').mockReturnValue({
        write: jest.fn(),
        pipe: jest.fn(),
        end: jest.fn(),
      } as any);

      await controller.exportBooksToCsv(mockResponse);

      expect(booksService.findAll).toHaveBeenCalled();
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=books.csv',
      );
      expect(fastCsv.format).toHaveBeenCalledWith({ headers: true });
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const mockBook = {
        id: 1,
        title: 'Book 1',
        ISBN: '1234567890',
        description: 'Description 1',
        price: 100,
        stock: 10,
      };

      jest.spyOn(booksService, 'findOne').mockResolvedValue(mockBook);

      const result = await controller.findOne('1');
      expect(result).toEqual(mockBook);
      expect(booksService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Book',
        price: 150,
      };

      const updatedBook = {
        id: 1,
        title: 'Updated Book',
        ISBN: '1234567890',
        description: 'Description 1',
        price: 150,
        stock: 10,
      };

      jest.spyOn(booksService, 'update').mockResolvedValue(updatedBook);

      const result = await controller.update('1', updateBookDto);
      expect(result).toEqual(updatedBook);
      expect(booksService.update).toHaveBeenCalledWith(1, updateBookDto);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      jest.spyOn(booksService, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');
      expect(booksService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('restore', () => {
    it('should restore a soft deleted book', async () => {
      jest.spyOn(booksService, 'restore').mockResolvedValue(undefined);

      await controller.restore('1');
      expect(booksService.restore).toHaveBeenCalledWith(1);
    });
  });

  describe('Guards', () => {
    it('should be protected with JwtAuthGuard', () => {
      const guards = Reflect.getMetadata('__guards__', BooksController);
      const guard = new guards[0]();

      expect(guard).toBeInstanceOf(JwtAuthGuard);
    });
  });
});
