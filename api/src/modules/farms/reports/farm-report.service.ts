import { FarmReportResponse, TotalAreaResponse, ChartResponse } from './farm-report.dto';
import { PlantedCulture } from '../../planted-cultures/planted-culture.entity';
import { CustomLogger } from '../../../common/logging/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Farm } from '../farm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FarmReportService {
  constructor(
    @InjectRepository(Farm)
    private readonly farmRepository: Repository<Farm>,
    @InjectRepository(PlantedCulture)
    private readonly plantedCultureRepository: Repository<PlantedCulture>,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('FarmReportService');
  }

  async getTotalFarms(): Promise<FarmReportResponse> {
    this.logger.log('[getTotalFarms] Iniciando cálculo do total de fazendas');

    const totalFarms = await this.farmRepository.count();
    const totalArea = await this.calculateTotalArea();
    const totalArableArea = await this.calculateTotalArableArea();
    const totalVegetationArea = await this.calculateTotalVegetationArea();
    const farmsByState = await this.getFarmsByState();

    const response: FarmReportResponse = {
      totalFarms,
      totalArea,
      totalArableArea,
      totalVegetationArea,
      metrics: {
        farmsByState: farmsByState.labels.map((state, index) => ({
          name: state,
          value: farmsByState.data[index],
        })),
        totalArea,
      },
    };

    this.logger.log(`[getTotalFarms] Cálculo concluído - Total: ${totalFarms} fazendas`);
    return response;
  }

  async getTotalArea(): Promise<TotalAreaResponse> {
    this.logger.log('[getTotalArea] Iniciando cálculo da área total');

    const totalArea = await this.calculateTotalArea();
    const totalArableArea = await this.calculateTotalArableArea();
    const totalVegetationArea = await this.calculateTotalVegetationArea();

    const response: TotalAreaResponse = {
      totalArea,
      totalArableArea,
      totalVegetationArea,
      unit: 'hectares',
    };

    this.logger.log(`[getTotalArea] Cálculo concluído - Área total: ${totalArea} hectares`);
    return response;
  }

  async getFarmsByState(): Promise<ChartResponse> {
    this.logger.log('[getFarmsByState] Iniciando cálculo da distribuição por estado');

    const farmsByState = await this.farmRepository
      .createQueryBuilder('farm')
      .select('farm.state', 'state')
      .addSelect('COUNT(*)', 'count')
      .groupBy('farm.state')
      .getRawMany();

    const response: ChartResponse = {
      labels: farmsByState.map(item => item.state),
      data: farmsByState.map(item => item.count),
    };

    this.logger.log('[getFarmsByState] Cálculo concluído');
    return response;
  }

  async getFarmsByCulture(): Promise<ChartResponse> {
    this.logger.log('[getFarmsByCulture] Iniciando cálculo da distribuição por cultura');

    const farmsByCulture = await this.plantedCultureRepository
      .createQueryBuilder('culture')
      .select('culture.name', 'culture')
      .addSelect('COUNT(DISTINCT culture.farmId)', 'count')
      .groupBy('culture.name')
      .getRawMany();

    const response: ChartResponse = {
      labels: farmsByCulture.map(item => item.culture),
      data: farmsByCulture.map(item => item.count),
    };

    this.logger.log('[getFarmsByCulture] Cálculo concluído');
    return response;
  }

  async getLandUseDistribution(): Promise<ChartResponse> {
    this.logger.log('[getLandUseDistribution] Iniciando cálculo da distribuição do uso do solo');

    const totalArableArea = await this.calculateTotalArableArea();
    const totalVegetationArea = await this.calculateTotalVegetationArea();

    const response: ChartResponse = {
      labels: ['Área Agricultável', 'Área de Vegetação'],
      data: [totalArableArea, totalVegetationArea],
    };

    this.logger.log('[getLandUseDistribution] Cálculo concluído');
    return response;
  }

  private async calculateTotalArea(): Promise<number> {
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.totalArea)', 'total')
      .getRawOne();
    return result?.total || 0;
  }

  private async calculateTotalArableArea(): Promise<number> {
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.arableArea)', 'total')
      .getRawOne();
    return result?.total || 0;
  }

  private async calculateTotalVegetationArea(): Promise<number> {
    const result = await this.farmRepository
      .createQueryBuilder('farm')
      .select('SUM(farm.vegetationArea)', 'total')
      .getRawOne();
    return result?.total || 0;
  }
} 