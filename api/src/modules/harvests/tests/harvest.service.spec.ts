import { CreateHarvestDto, UpdateHarvestDto } from '../harvest.dto';
import { CustomLogger } from 'src/common/logging/logger.service';
import { HarvestNotFoundException } from '../harvest.exception';
import { HarvestRepository } from '../harvest.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from '../harvest.service';


describe('HarvestService', () => {
  let service: HarvestService;
  let repository: HarvestRepository;

  const mockHarvest = {
    id: 1,
    name: 'Colheita 2024',
    harvestYear: 2024,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockHarvestRepository = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockHarvest]),
    findById: jest.fn().mockResolvedValue(mockHarvest),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockHarvest, ...data })),
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
        HarvestService,
        {
          provide: HarvestRepository,
          useValue: mockHarvestRepository,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    repository = module.get<HarvestRepository>(HarvestRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma colheita com sucesso', async () => {
      const createDto: CreateHarvestDto = {
        name: 'Colheita 2024',
        harvestYear: 2024,
      };

      const result = await service.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.harvestYear).toBe(createDto.harvestYear);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de colheitas', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma colheita pelo id', async () => {
      const result = await service.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('deve lançar HarvestNotFoundException quando a colheita não for encontrada', async () => {
      mockHarvestRepository.findById.mockResolvedValueOnce(null);
      await expect(service.findOne('999')).rejects.toThrow(HarvestNotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma colheita com sucesso', async () => {
      const updateDto: UpdateHarvestDto = {
        name: 'Colheita 2024 Atualizada',
        harvestYear: 2025,
      };

      const result = await service.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(result.harvestYear).toBe(updateDto.harvestYear);
      expect(repository.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('deve lançar HarvestNotFoundException quando a colheita não for encontrada', async () => {
      mockHarvestRepository.findById.mockResolvedValueOnce(null);
      await expect(service.update('999', { name: 'Teste' })).rejects.toThrow(HarvestNotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma colheita com sucesso', async () => {
      await expect(service.remove('1')).resolves.not.toThrow();
      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('deve lançar HarvestNotFoundException quando a colheita não for encontrada', async () => {
      mockHarvestRepository.findById.mockResolvedValueOnce(null);
      await expect(service.remove('999')).rejects.toThrow(HarvestNotFoundException);
    });
  });
}); 