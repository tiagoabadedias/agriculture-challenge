import { CustomLogger } from '../../../common/logging/logger.service';
import { ProducerController } from '../producer.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from '../producer.service';
import { CreateProducerDto } from '../producer.dto';

describe('ProducerController', () => {
  let controller: ProducerController;
  let service: ProducerService;

  const mockProducer = {
    id: 1,
    name: 'Test Producer',
    document: '123.456.789-00',
    farms: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProducerService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1, document: '123.456.789-00' })),
    findAll: jest.fn().mockResolvedValue([mockProducer]),
    findById: jest.fn().mockResolvedValue(mockProducer),
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
      controllers: [ProducerController],
      providers: [
        {
          provide: ProducerService,
          useValue: mockProducerService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    service = module.get<ProducerService>(ProducerService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produtor', async () => {
      const createDto: CreateProducerDto = {
        name: 'Test Producer',
        document: '12345678900',
      };

      const result = await controller.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.document).toBe('123.456.789-00');
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de produtores', async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um produtor pelo id', async () => {
      const result = await controller.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(service.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('deve atualizar um produtor', async () => {
      const updateDto = {
        name: 'Updated Producer',
      };

      const result = await controller.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover um produtor', async () => {
      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
}); 