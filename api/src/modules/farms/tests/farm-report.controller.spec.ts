import { ChartResponse, FarmReportResponse, TotalAreaResponse } from '../reports/farm-report.dto';
import { FarmReportController } from '../reports/farm-report.controller';
import { FarmReportService } from '../reports/farm-report.service';
import { Test, TestingModule } from '@nestjs/testing';


describe('FarmReportController', () => {
  let controller: FarmReportController;
  let service: FarmReportService;

  const mockFarmReportService = {
    getTotalFarms: jest.fn(),
    getTotalArea: jest.fn(),
    getFarmsByState: jest.fn(),
    getFarmsByCulture: jest.fn(),
    getLandUseDistribution: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmReportController],
      providers: [
        {
          provide: FarmReportService,
          useValue: mockFarmReportService,
        },
      ],
    }).compile();

    controller = module.get<FarmReportController>(FarmReportController);
    service = module.get<FarmReportService>(FarmReportService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getTotalFarms', () => {
    it('deve retornar o total de fazendas e métricas', async () => {
      const mockResponse: FarmReportResponse = {
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
      };

      mockFarmReportService.getTotalFarms.mockResolvedValue(mockResponse);

      const result = await controller.getTotalFarms();

      expect(result).toEqual(mockResponse);
      expect(service.getTotalFarms).toHaveBeenCalled();
    });
  });

  describe('getTotalArea', () => {
    it('deve retornar o total de área em hectares', async () => {
      const mockResponse: TotalAreaResponse = {
        totalArea: 1000,
        totalArableArea: 800,
        totalVegetationArea: 200,
        unit: 'hectares',
      };

      mockFarmReportService.getTotalArea.mockResolvedValue(mockResponse);

      const result = await controller.getTotalArea();

      expect(result).toEqual(mockResponse);
      expect(service.getTotalArea).toHaveBeenCalled();
    });
  });

  describe('getFarmsByState', () => {
    it('deve retornar a distribuição de fazendas por estado', async () => {
      const mockResponse: ChartResponse = {
        labels: ['SP', 'MG'],
        data: [5, 5],
      };

      mockFarmReportService.getFarmsByState.mockResolvedValue(mockResponse);

      const result = await controller.getFarmsByState();

      expect(result).toEqual(mockResponse);
      expect(service.getFarmsByState).toHaveBeenCalled();
    });
  });

  describe('getFarmsByCulture', () => {
    it('deve retornar a distribuição de fazendas por cultura', async () => {
      const mockResponse: ChartResponse = {
        labels: ['Soja', 'Milho'],
        data: [6, 4],
      };

      mockFarmReportService.getFarmsByCulture.mockResolvedValue(mockResponse);

      const result = await controller.getFarmsByCulture();

      expect(result).toEqual(mockResponse);
      expect(service.getFarmsByCulture).toHaveBeenCalled();
    });
  });

  describe('getLandUseDistribution', () => {
    it('deve retornar a distribuição do uso do solo', async () => {
      const mockResponse: ChartResponse = {
        labels: ['Área Agricultável', 'Área de Vegetação'],
        data: [800, 200],
      };

      mockFarmReportService.getLandUseDistribution.mockResolvedValue(mockResponse);

      const result = await controller.getLandUseDistribution();

      expect(result).toEqual(mockResponse);
      expect(service.getLandUseDistribution).toHaveBeenCalled();
    });
  });
}); 