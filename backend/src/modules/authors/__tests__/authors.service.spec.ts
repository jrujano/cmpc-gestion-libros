import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../authors.service';
import { getModelToken } from '@nestjs/sequelize';
import { Author } from '../models/author.model';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorModel: typeof Author;
  let sequelize: Sequelize;
  let logger: Logger;

  // Mock para transacción
  const mockTransaction = {
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
  };

  // Mock para Author
  const mockAuthor = {
    id: 1,
    name: 'John Doe',
    biography: 'Famous writer',
    birthDate: new Date('1980-01-01'),
    update: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  };

  // Mock para Logger
  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: Logger,
          useValue: mockLogger,
        },
        {
          provide: getModelToken(Author),
          useValue: {
            create: jest.fn().mockResolvedValue(mockAuthor),
            findAll: jest.fn().mockResolvedValue([mockAuthor]),
            findByPk: jest.fn().mockResolvedValue(mockAuthor),
            findOne: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: 'SEQUELIZE',
          useValue: {
            transaction: jest.fn().mockResolvedValue(mockTransaction),
          },
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorModel = module.get<typeof Author>(getModelToken(Author));
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
    const createAuthorDto: CreateAuthorDto = {
      name: 'John Doe',
      biography: 'Famous writer',
      birthDate: new Date('1980-01-01'),
    };

    it('should create an author successfully', async () => {
      const result = await service.create(createAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(authorModel.create).toHaveBeenCalledWith(createAuthorDto, {
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Creando nuevo autor', {
        name: 'John Doe',
      });
    });

    it('should rollback transaction on error', async () => {
      (authorModel.create as jest.Mock).mockRejectedValueOnce(
        new Error('DB Error'),
      );

      await expect(service.create(createAuthorDto)).rejects.toThrow('DB Error');
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'Error al crear autor',
        expect.any(Error),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockAuthor]);
      expect(authorModel.findAll).toHaveBeenCalled();
    });

    it('should return empty array if no authors exist', async () => {
      (authorModel.findAll as jest.Mock).mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single author with books', async () => {
      const result = await service.findOne(1);

      expect(result).toEqual(mockAuthor);
      expect(authorModel.findByPk).toHaveBeenCalledWith(1, {
        include: ['books'],
      });
    });

    it('should throw NotFoundException if author not found', async () => {
      (authorModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateAuthorDto: UpdateAuthorDto = {
      name: 'Updated Name',
      biography: 'Updated biography',
    };

    it('should update an author successfully', async () => {
      const result = await service.update(1, updateAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(authorModel.findByPk).toHaveBeenCalledWith(1, {
        transaction: mockTransaction,
      });
      expect(mockAuthor.update).toHaveBeenCalledWith(updateAuthorDto, {
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        'Autor ID 1 actualizado correctamente',
      );
    });

    it('should throw NotFoundException if author not found', async () => {
      (authorModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.update(999, updateAuthorDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      (mockAuthor.update as jest.Mock).mockRejectedValueOnce(
        new Error('Update Error'),
      );

      await expect(service.update(1, updateAuthorDto)).rejects.toThrow(
        'Update Error',
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'Error al actualizar autor ID 1',
        expect.any(Error),
      );
    });
  });

  describe('remove', () => {
    it('should delete an author successfully', async () => {
      await service.remove(1);

      expect(authorModel.findByPk).toHaveBeenCalledWith(1, {
        transaction: mockTransaction,
      });
      expect(mockAuthor.destroy).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(
        'Autor ID 1 eliminado correctamente',
      );
    });

    it('should throw NotFoundException if author not found', async () => {
      (authorModel.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      (mockAuthor.destroy as jest.Mock).mockRejectedValueOnce(
        new Error('Delete Error'),
      );

      await expect(service.remove(1)).rejects.toThrow('Delete Error');
      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(
        'Error al eliminar autor ID 1',
        expect.any(Error),
      );
    });
  });
});
