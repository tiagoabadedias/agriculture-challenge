import { CreateHarvestDto, UpdateHarvestDto } from '../harvest.dto';
import { CustomLogger } from 'src/common/logging/logger.service';
import { HarvestNotFoundException } from '../harvest.exception';
import { HarvestController } from '../harvest.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { HarvestService } from '../harvest.service';


describe('HarvestController', () => {
  let controller: HarvestController;
  let service: HarvestService;

  const mockHarvest = {
    id: 1,
    name: 'Colheita 2024',
    harvestYear: 2024,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockHarvestService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...dto, id: 1 })),
    findAll: jest.fn().mockResolvedValue([mockHarvest]),
    findOne: jest.fn().mockResolvedValue(mockHarvest),
    update: jest.fn().mockImplementation((id, data) => Promise.resolve({ ...mockHarvest, ...data })),
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
      controllers: [HarvestController],
      providers: [
        {
          provide: HarvestService,
          useValue: mockHarvestService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
    service = module.get<HarvestService>(HarvestService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma colheita com sucesso', async () => {
      const createDto: CreateHarvestDto = {
        name: 'Colheita 2024',
        harvestYear: 2024,
      };

      const result = await controller.create(createDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.harvestYear).toBe(createDto.harvestYear);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('deve lançar BadRequestException quando ocorrer um erro', async () => {
      const createDto: CreateHarvestDto = {
        name: 'Colheita 2024',
        harvestYear: 2024,
      };

      mockHarvestService.create.mockRejectedValueOnce(new Error('Erro ao criar colheita'));
      await expect(controller.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('deve retornar um array de colheitas', async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar uma colheita pelo id', async () => {
      const result = await controller.findOne('1');
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('deve lançar HarvestNotFoundException quando a colheita não for encontrada', async () => {
      mockHarvestService.findOne.mockRejectedValueOnce(new HarvestNotFoundException('999'));
      await expect(controller.findOne('999')).rejects.toThrow(HarvestNotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar uma colheita com sucesso', async () => {
      const updateDto: UpdateHarvestDto = {
        name: 'Colheita 2024 Atualizada',
        harvestYear: 2025,
      };

      const result = await controller.update('1', updateDto);
      expect(result).toBeDefined();
      expect(result.name).toBe(updateDto.name);
      expect(result.harvestYear).toBe(updateDto.harvestYear);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('deve lançar HarvestNotFoundException quando a colheita não for encontrada', async () => {
      mockHarvestService.update.mockRejectedValueOnce(new HarvestNotFoundException('999'));
      await expect(controller.update('999', { name: 'Teste' })).rejects.toThrow(HarvestNotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover uma colheita com sucesso', async () => {
      await expect(controller.remove('1')).resolves.not.toThrow();
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('deve lançar HarvestNotFoundException quando a colheita não for encontrada', async () => {
      mockHarvestService.remove.mockRejectedValueOnce(new HarvestNotFoundException('999'));
      await expect(controller.remove('999')).rejects.toThrow(HarvestNotFoundException);
    });
  });
}); 