import { InvalidPlantedAreaException, PlantedCultureNotFoundException } from '../invalid-planted-area.exception';
import { PlantedCultureRepository } from '../planted-culture.repository';
import { PlantedCultureService } from '../planted-culture.service';
import { CustomLogger } from 'src/common/logging/logger.service';
import { CreatePlantedCultureDto } from '../planted-culture.dto';
import { Test, TestingModule } from '@nestjs/testing';


describe('PlantedCultureService', () => {
  let service: PlantedCultureService;
  let repository: PlantedCultureRepository;

  const mockPlantedCulture = {
    id: 1,
    name: 'Soja',
    area: 100,
    farm: { id: 1, name: 'Fazenda Teste' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlantedCultureRepository = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockPlantedCulture]),
    findById: jest.fn().mockResolvedValue(mockPlantedCulture),
    findByFarm: jest.fn().mockResolvedValue([mockPlantedCulture]),
    findByHarvest: jest.fn().mockResolvedValue([mockPlantedCulture]),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockPlantedCulture, ...data })),
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
        PlantedCultureService,
        {
          provide: PlantedCultureRepository,
          useValue: mockPlantedCultureRepository,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<PlantedCultureService>(PlantedCultureService);
    repository = module.get<PlantedCultureRepository>(PlantedCultureRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma cultura plantada com sucesso', async () => {
      const createDto: CreatePlantedCultureDto = {
        name: 'Soja',
        area: 100,
        farmId: '1',
        harvestId: '1',
      };

      const result = await service.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.area).toBe(createDto.area);
    });

    it('deve lançar InvalidPlantedAreaException para área inválida', async () => {
      const createDto: CreatePlantedCultureDto = {
        name: 'Soja',
        area: -100,
        farmId: '1',
        harvestId: '1',
      };

      await expect(service.create(createDto)).rejects.toThrow(InvalidPlantedAreaException);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de culturas plantadas', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma cultura plantada pelo id', async () => {
      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('deve lançar PlantedCultureNotFoundException quando a cultura não for encontrada', async () => {
      mockPlantedCultureRepository.findById.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(PlantedCultureNotFoundException);
    });
  });

  describe('findByFarmId', () => {
    it('deve retornar um array de culturas plantadas da fazenda', async () => {
      const result = await service.findByFarmId('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findByHarvestId', () => {
    it('deve retornar um array de culturas plantadas da colheita', async () => {
      const result = await service.findByHarvestId('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('deve atualizar uma cultura plantada com sucesso', async () => {
      const updateDto = {
        name: 'Milho',
        area: 150,
      };

      const result = await service.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(result.area).toBe(updateDto.area);
    });

    it('deve lançar PlantedCultureNotFoundException quando a cultura não for encontrada', async () => {
      mockPlantedCultureRepository.findById.mockResolvedValueOnce(null);
      await expect(service.update('999', { name: 'Milho' })).rejects.toThrow(PlantedCultureNotFoundException);
    });

    it('deve lançar InvalidPlantedAreaException para área inválida', async () => {
      const updateDto = {
        area: -150,
      };

      await expect(service.update('1', updateDto)).rejects.toThrow(InvalidPlantedAreaException);
    });
  });

  describe('remove', () => {
    it('deve remover uma cultura plantada com sucesso', async () => {
      await expect(service.remove('1')).resolves.not.toThrow();
    });

    it('deve lançar PlantedCultureNotFoundException quando a cultura não for encontrada', async () => {
      mockPlantedCultureRepository.findById.mockResolvedValueOnce(null);
      await expect(service.remove('999')).rejects.toThrow(PlantedCultureNotFoundException);
    });
  });
}); 