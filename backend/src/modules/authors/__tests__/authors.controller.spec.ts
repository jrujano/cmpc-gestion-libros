import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from '../authors.controller';
import { AuthorsService } from '../authors.service';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let service: AuthorsService;

  // Mock para el servicio
  const mockAuthorsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Datos de prueba
  const mockAuthor = {
    id: 1,
    name: 'John Doe',
    biography: 'Famous writer',
    birthDate: new Date('1980-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
    service = module.get<AuthorsService>(AuthorsService);

    // Resetear mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        biography: 'Famous writer',
        birthDate: new Date('1980-01-01'),
      };

      mockAuthorsService.create.mockResolvedValue(mockAuthor);

      const result = await controller.create(createAuthorDto);

      expect(result).toEqual(mockAuthor);
      expect(service.create).toHaveBeenCalledWith(createAuthorDto);
    });

    it('should throw error when service fails', async () => {
      const createAuthorDto: CreateAuthorDto = {
        name: 'John Doe',
        biography: 'Famous writer',
        birthDate: new Date('1980-01-01'),
      };

      mockAuthorsService.create.mockRejectedValue(new Error('Service Error'));

      await expect(controller.create(createAuthorDto)).rejects.toThrow(
        'Service Error',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      mockAuthorsService.findAll.mockResolvedValue([mockAuthor]);

      const result = await controller.findAll();

      expect(result).toEqual([mockAuthor]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no authors exist', async () => {
      mockAuthorsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single author', async () => {
      mockAuthorsService.findOne.mockResolvedValue(mockAuthor);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockAuthor);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw error when author not found', async () => {
      mockAuthorsService.findOne.mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow();
    });

    it('should validate id parameter', async () => {
      await expect(controller.findOne('invalid')).rejects.toThrow();
    });
  });

  describe('update', () => {
    const updateAuthorDto: UpdateAuthorDto = {
      name: 'Updated Name',
      biography: 'Updated biography',
    };

    it('should update an author', async () => {
      mockAuthorsService.update.mockResolvedValue({
        ...mockAuthor,
        ...updateAuthorDto,
      });

      const result = await controller.update('1', updateAuthorDto);

      expect(result).toEqual({
        ...mockAuthor,
        ...updateAuthorDto,
      });
      expect(service.update).toHaveBeenCalledWith(1, updateAuthorDto);
    });

    it('should throw error when update fails', async () => {
      mockAuthorsService.update.mockRejectedValue(new Error('Update Error'));

      await expect(controller.update('1', updateAuthorDto)).rejects.toThrow(
        'Update Error',
      );
    });
  });

  describe('remove', () => {
    it('should delete an author', async () => {
      mockAuthorsService.remove.mockResolvedValue(mockAuthor);

      const result = await controller.remove('1');

      expect(result).toEqual(mockAuthor);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw error when deletion fails', async () => {
      mockAuthorsService.remove.mockRejectedValue(new Error('Delete Error'));

      await expect(controller.remove('1')).rejects.toThrow('Delete Error');
    });
  });
});
