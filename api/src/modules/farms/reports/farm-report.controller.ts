import { FarmReportResponse, TotalAreaResponse, ChartResponse } from './farm-report.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FarmReportService } from './farm-report.service';
import { Controller, Get } from '@nestjs/common';

@ApiTags('Fazendas - Relatórios')
@Controller('farms/reports')
export class FarmReportController {
  constructor(private readonly farmReportService: FarmReportService) {}

  @Get('total')
  @ApiOperation({ summary: 'Obter total de fazendas cadastradas' })
  @ApiResponse({ status: 200, description: 'Retorna o total de fazendas cadastradas e métricas', type: FarmReportResponse })
  async getTotalFarms(): Promise<FarmReportResponse> {
    return this.farmReportService.getTotalFarms();
  }

  @Get('total-area')
  @ApiOperation({ summary: 'Obter total de hectares registrados' })
  @ApiResponse({ status: 200, description: 'Retorna o total de área em hectares', type: TotalAreaResponse })
  async getTotalArea(): Promise<TotalAreaResponse> {
    return this.farmReportService.getTotalArea();
  }

  @Get('by-state')
  @ApiOperation({ summary: 'Obter distribuição de fazendas por estado' })
  @ApiResponse({ status: 200, description: 'Retorna a distribuição de fazendas por estado em formato de gráfico de pizza', type: ChartResponse })
  async getFarmsByState(): Promise<ChartResponse> {
    return this.farmReportService.getFarmsByState();
  }

  @Get('by-culture')
  @ApiOperation({ summary: 'Obter distribuição de fazendas por cultura plantada' })
  @ApiResponse({ status: 200, description: 'Retorna a distribuição de fazendas por cultura plantada em formato de gráfico de pizza', type: ChartResponse })
  async getFarmsByCulture(): Promise<ChartResponse> {
    return this.farmReportService.getFarmsByCulture();
  }

  @Get('soil')
  @ApiOperation({ summary: 'Obter distribuição do uso do solo' })
  @ApiResponse({ status: 200, description: 'Retorna a distribuição do uso do solo em formato de gráfico de pizza', type: ChartResponse })
  async getLandUseDistribution(): Promise<ChartResponse> {
    return this.farmReportService.getLandUseDistribution();
  }
}
