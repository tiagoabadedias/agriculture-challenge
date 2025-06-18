import { ProducerNotFoundException } from '../../producers/producer.exception';
import { CustomLogger } from 'src/common/logging/logger.service';
import { FarmNotFoundException } from '../farm.exception';
import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from '../farm.controller';
import { FarmService } from '../farm.service';
import { CreateFarmDto } from '../farm.dto';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  const mockFarm = {
    id: 1,
    name: 'Fazenda São João',
    state: 'SP',
    city: 'São Paulo',
    totalArea: 1000,
    arableArea: 800,
    vegetationArea: 200,
    producerId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFarmService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockFarm]),
    findOne: jest.fn().mockResolvedValue(mockFarm),
    findByProducerId: jest.fn().mockResolvedValue([mockFarm]),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockFarm, ...data })),
    remove: jest.fn().mockResolvedValue(undefined),
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
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
          useValue: mockFarmService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma fazenda com sucesso', async () => {
      const createDto: CreateFarmDto = {
        name: 'Fazenda São João',
        state: 'SP',
        city: 'São Paulo',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
        producerId: '1',
      };

      const result = await controller.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de fazendas', async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma fazenda pelo id', async () => {
      const result = await controller.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('deve lançar FarmNotFoundException quando a fazenda não for encontrada', async () => {
      mockFarmService.findOne.mockRejectedValueOnce(new FarmNotFoundException('999'));
      await expect(controller.findOne('999')).rejects.toThrow(FarmNotFoundException);
    });
  });

  describe('findByProducer', () => {
    it('deve retornar um array de fazendas do produtor', async () => {
      const result = await controller.findByProducer('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findByProducerId).toHaveBeenCalledWith('1');
    });

    it('deve lançar ProducerNotFoundException quando o produtor não existir', async () => {
      mockFarmService.findByProducerId.mockRejectedValueOnce(new ProducerNotFoundException('999'));
      await expect(controller.findByProducer('999')).rejects.toThrow(ProducerNotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma fazenda com sucesso', async () => {
      const updateDto = {
        name: 'Fazenda São João Atualizada',
        city: 'Campinas',
      };

      const result = await controller.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('deve lançar FarmNotFoundException quando a fazenda não for encontrada', async () => {
      mockFarmService.update.mockRejectedValueOnce(new FarmNotFoundException('999'));
      await expect(controller.update('999', { name: 'Teste' })).rejects.toThrow(FarmNotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma fazenda com sucesso', async () => {
      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('deve lançar FarmNotFoundException quando a fazenda não for encontrada', async () => {
      mockFarmService.remove.mockRejectedValueOnce(new FarmNotFoundException('999'));
      await expect(controller.remove('999')).rejects.toThrow(FarmNotFoundException);
    });
  });
}); 