import { PlantedCultureController } from '../planted-culture.controller';
import { PlantedCultureService } from '../planted-culture.service';
import { CustomLogger } from 'src/common/logging/logger.service';
import { CreatePlantedCultureDto } from '../planted-culture.dto';
import { Test, TestingModule } from '@nestjs/testing';


describe('PlantedCultureController', () => {
  let controller: PlantedCultureController;
  let service: PlantedCultureService;

  const mockPlantedCulture = {
    id: 1,
    name: 'Soja',
    area: 100,
    farm: { id: 1, name: 'Fazenda Teste' },
    harvest: { id: 1, name: 'Colheita 2024' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPlantedCultureService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockPlantedCulture]),
    findOne: jest.fn().mockResolvedValue(mockPlantedCulture),
    findByFarmId: jest.fn().mockResolvedValue([mockPlantedCulture]),
    findByHarvestId: jest.fn().mockResolvedValue([mockPlantedCulture]),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockPlantedCulture, ...data })),
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
      controllers: [PlantedCultureController],
      providers: [
        {
          provide: PlantedCultureService,
          useValue: mockPlantedCultureService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<PlantedCultureController>(PlantedCultureController);
    service = module.get<PlantedCultureService>(PlantedCultureService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma cultura plantada com sucesso', async () => {
      const createDto: CreatePlantedCultureDto = {
        name: 'Soja',
        area: 100,
        farmId: '1',
        harvestId: '1',
      };

      const result = await controller.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.area).toBe(createDto.area);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de culturas plantadas', async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma cultura plantada pelo id', async () => {
      const result = await controller.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findByFarm', () => {
    it('deve retornar um array de culturas plantadas da fazenda', async () => {
      const result = await controller.findByFarm('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findByFarmId).toHaveBeenCalledWith('1');
    });
  });

  describe('findByHarvest', () => {
    it('deve retornar um array de culturas plantadas da colheita', async () => {
      const result = await controller.findByHarvest('1');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findByHarvestId).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('deve atualizar uma cultura plantada com sucesso', async () => {
      const updateDto = {
        name: 'Milho',
        area: 150,
      };

      const result = await controller.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(result.area).toBe(updateDto.area);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('deve remover uma cultura plantada com sucesso', async () => {
      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
}); 