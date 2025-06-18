import { PlantedCulture } from '../../planted-cultures/planted-culture.entity';
import { CustomLogger } from '../../../common/logging/logger.service';
import { FarmReportService } from '../reports/farm-report.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from '../farm.entity';
import { Repository } from 'typeorm';

describe('FarmReportService', () => {
  let service: FarmReportService;
  let farmRepository: Repository<Farm>;
  let plantedCultureRepository: Repository<PlantedCulture>;
  let logger: CustomLogger;

  const mockFarmRepository = {
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockPlantedCultureRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
  };

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmReportService,
        {
          provide: getRepositoryToken(Farm),
          useValue: mockFarmRepository,
        },
        {
          provide: getRepositoryToken(PlantedCulture),
          useValue: mockPlantedCultureRepository,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<FarmReportService>(FarmReportService);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    plantedCultureRepository = module.get<Repository<PlantedCulture>>(getRepositoryToken(PlantedCulture));
    logger = module.get<CustomLogger>(CustomLogger);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFarmRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockPlantedCultureRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getTotalFarms', () => {
    it('deve retornar o total de fazendas e métricas', async () => {
      mockFarmRepository.count.mockResolvedValue(10);
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ total: 1000 })
        .mockResolvedValueOnce({ total: 800 })
        .mockResolvedValueOnce({ total: 200 });
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { state: 'SP', count: 5 },
        { state: 'MG', count: 5 },
      ]);

      const result = await service.getTotalFarms();

      expect(result).toEqual({
        totalFarms: 10,
        totalArea: 1000,
        totalArableArea: 800,
        totalVegetationArea: 200,
        metrics: {
          farmsByState: [
            { name: 'SP', value: 5 },
            { name: 'MG', value: 5 },
          ],
          totalArea: 1000,
        },
      });
    });
  });

  describe('getTotalArea', () => {
    it('deve retornar o total de área em hectares', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ total: 1000 })
        .mockResolvedValueOnce({ total: 800 }) 
        .mockResolvedValueOnce({ total: 200 });

      const result = await service.getTotalArea();

      expect(result).toEqual({
        totalArea: 1000,
        totalArableArea: 800,
        totalVegetationArea: 200,
        unit: 'hectares',
      });
    });

    it('deve retornar zeros quando não houver dados', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: null });

      const result = await service.getTotalArea();

      expect(result).toEqual({
        totalArea: 0,
        totalArableArea: 0,
        totalVegetationArea: 0,
        unit: 'hectares',
      });
    });
  });

  describe('getFarmsByState', () => {
    it('deve retornar a distribuição de fazendas por estado', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { state: 'SP', count: 5 },
        { state: 'MG', count: 5 },
      ]);

      const result = await service.getFarmsByState();

      expect(result).toEqual({
        labels: ['SP', 'MG'],
        data: [5, 5],
      });
    });
  });

  describe('getFarmsByCulture', () => {
    it('deve retornar a distribuição de fazendas por cultura', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { culture: 'Soja', count: 6 },
        { culture: 'Milho', count: 4 },
      ]);

      const result = await service.getFarmsByCulture();

      expect(result).toEqual({
        labels: ['Soja', 'Milho'],
        data: [6, 4],
      });
    });
  });

  describe('getLandUseDistribution', () => {
    it('deve retornar a distribuição do uso do solo', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ total: 800 })
        .mockResolvedValueOnce({ total: 200 });

      const result = await service.getLandUseDistribution();

      expect(result).toEqual({
        labels: ['Área Agricultável', 'Área de Vegetação'],
        data: [800, 200],
      });
    });

    it('deve retornar zeros quando não houver dados', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ total: null });

      const result = await service.getLandUseDistribution();

      expect(result).toEqual({
        labels: ['Área Agricultável', 'Área de Vegetação'],
        data: [0, 0],
      });
    });
  });
}); 