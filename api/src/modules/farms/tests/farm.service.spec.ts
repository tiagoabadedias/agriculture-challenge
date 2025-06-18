import { FarmNotFoundException, InvalidFarmAreaException } from '../farm.exception';
import { ProducerNotFoundException } from '../../producers/producer.exception';
import { CustomLogger } from 'src/common/logging/logger.service';
import { CreateFarmDto, UpdateFarmDto } from '../farm.dto';
import { Producer } from '../../producers/producer.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FarmRepository } from '../farm.repository';
import { FarmService } from '../farm.service';
import { Repository } from 'typeorm';

describe('FarmService', () => {
  let service: FarmService;
  let farmRepository: FarmRepository;
  let producerRepository: Repository<Producer>;

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

  const mockProducer = {
    id: '1',
    name: 'João da Silva',
    document: '12345678900',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFarmRepository = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockFarm]),
    findById: jest.fn().mockResolvedValue(mockFarm),
    findByProducerId: jest.fn().mockResolvedValue([mockFarm]),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockFarm, ...data })),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockProducerRepository = {
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      return id === '1' ? Promise.resolve(mockProducer) : Promise.resolve(null);
    }),
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
        FarmService,
        {
          provide: FarmRepository,
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(Producer),
          useValue: mockProducerRepository,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    farmRepository = module.get<FarmRepository>(FarmRepository);
    producerRepository = module.get<Repository<Producer>>(getRepositoryToken(Producer));
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
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

      const result = await service.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(farmRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('deve lançar InvalidFarmAreaException quando a soma das áreas for maior que a área total', async () => {
      const createDto: CreateFarmDto = {
        name: 'Fazenda São João',
        state: 'SP',
        city: 'São Paulo',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 300,
        producerId: '1',
      };

      await expect(service.create(createDto)).rejects.toThrow(InvalidFarmAreaException);
    });

    it('deve lançar ProducerNotFoundException quando o produtor não existir', async () => {
      const createDto: CreateFarmDto = {
        name: 'Fazenda São João',
        state: 'SP',
        city: 'São Paulo',
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 200,
        producerId: '999',
      };

      await expect(service.create(createDto)).rejects.toThrow(ProducerNotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de fazendas', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(farmRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma fazenda pelo id', async () => {
      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(farmRepository.findById).toHaveBeenCalledWith('1');
    });

    it('deve lançar FarmNotFoundException quando a fazenda não for encontrada', async () => {
      mockFarmRepository.findById.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(FarmNotFoundException);
    });
  });

  describe('findByProducerId', () => {
    it('deve retornar um array de fazendas do produtor', async () => {
      const result = await service.findByProducerId('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(farmRepository.findByProducerId).toHaveBeenCalledWith('1');
    });

    it('deve lançar ProducerNotFoundException quando o produtor não existir', async () => {
      await expect(service.findByProducerId('999')).rejects.toThrow(ProducerNotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma fazenda com sucesso', async () => {
      const updateDto: UpdateFarmDto = {
        name: 'Fazenda São João Atualizada',
        city: 'Campinas',
      };

      const result = await service.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(farmRepository.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('deve lançar FarmNotFoundException quando a fazenda não for encontrada', async () => {
      mockFarmRepository.findById.mockResolvedValueOnce(null);
      await expect(service.update('999', { name: 'Teste' })).rejects.toThrow(FarmNotFoundException);
    });

    it('deve lançar InvalidFarmAreaException quando a soma das áreas atualizadas for maior que a área total', async () => {
      const updateDto: UpdateFarmDto = {
        totalArea: 1000,
        arableArea: 800,
        vegetationArea: 300,
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(InvalidFarmAreaException);
    });

    it('deve lançar ProducerNotFoundException quando o novo produtor não existir', async () => {
      const updateDto: UpdateFarmDto = {
        producerId: '999',
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(ProducerNotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma fazenda com sucesso', async () => {
      await expect(service.remove('1')).resolves.not.toThrow();
      expect(farmRepository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar FarmNotFoundException quando a fazenda não for encontrada', async () => {
      mockFarmRepository.findById.mockResolvedValueOnce(null);
      await expect(service.remove('999')).rejects.toThrow(FarmNotFoundException);
    });
  });
}); 