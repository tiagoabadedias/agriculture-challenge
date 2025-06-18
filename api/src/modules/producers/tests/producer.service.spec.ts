import { InvalidProducerDocumentException, ProducerAlreadyExistsException, ProducerNotFoundException } from '../producer.exception';
import { CustomLogger } from '../../../common/logging/logger.service';
import { ProducerRepository } from '../producer.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from '../producer.service';
import { CreateProducerDto } from '../producer.dto';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: ProducerRepository;

  const mockProducer = {
    id: 1,
    name: 'Test Producer',
    document: '123.456.789-00',
    farms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProducerRepository = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockProducer]),
    findById: jest.fn().mockResolvedValue(mockProducer),
    findByDocument: jest.fn().mockResolvedValue(null),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockProducer, ...data })),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: ProducerRepository,
          useValue: mockProducerRepository,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<ProducerRepository>(ProducerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer successfully', async () => {
      const createDto: CreateProducerDto = {
        name: 'Test Producer',
        document: '12345678900',
      };

      const result = await service.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.document).toBe('123.456.789-00');
    });

    it('should throw ProducerAlreadyExistsException when document already exists', async () => {
      const createDto: CreateProducerDto = {
        name: 'Test Producer',
        document: '12345678900',
      };

      mockProducerRepository.findByDocument.mockResolvedValueOnce(mockProducer);

      await expect(service.create(createDto)).rejects.toThrow(ProducerAlreadyExistsException);
    });

    it('should throw InvalidProducerDocumentException for invalid document length', async () => {
      const createDto: CreateProducerDto = {
        name: 'Test Producer',
        document: '123456789', 
      };

      await expect(service.create(createDto)).rejects.toThrow(InvalidProducerDocumentException);
    });
  });

  describe('findAll', () => {
    it('should return an array of producers', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findById', () => {
    it('should return a producer by id', async () => {
      const result = await service.findById('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should throw ProducerNotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValueOnce(null);
      await expect(service.findById('999')).rejects.toThrow(ProducerNotFoundException);
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const updateDto = {
        name: 'Updated Producer',
      };

      const result = await service.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
    });

    it('should throw ProducerNotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValueOnce(null);
      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(ProducerNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a producer successfully', async () => {
      await expect(service.delete('1')).resolves.not.toThrow();
    });

    it('should throw ProducerNotFoundException when producer not found', async () => {
      mockProducerRepository.findById.mockResolvedValueOnce(null);
      await expect(service.delete('999')).rejects.toThrow(ProducerNotFoundException);
    });
  });
}); 