import { ApiProperty } from '@nestjs/swagger';

export class FarmReportResponse {
  @ApiProperty({ description: 'Total de fazendas', example: 10 })
  totalFarms: number;

  @ApiProperty({ description: 'Total de área em hectares', example: 1000 })
  totalArea: number;

  @ApiProperty({ description: 'Total de área arável em hectares', example: 800 })
  totalArableArea: number;

  @ApiProperty({
    description: 'Total de área de vegetação em hectares',
    example: 200,
  })
  totalVegetationArea: number;

  @ApiProperty({
    description: 'Métricas das fazendas',
    type: 'object',
    properties: {
      farmsByState: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'SP',
            },
            value: {
              type: 'number',
              example: 5,
            },
          },
        },
      },
      totalArea: {
        type: 'number',
        example: 1000,
        description: 'Área total em hectares',
      },
    },
  })
  metrics: {
    farmsByState: Array<{
      name: string;
      value: number;
    }>;
    totalArea: number;
  };
}

export class TotalAreaResponse {
  @ApiProperty({ description: 'Total de área em hectares', example: 1000 })
  totalArea: number;

  @ApiProperty({ description: 'Total de área arável em hectares', example: 800 })
  totalArableArea: number;

  @ApiProperty({ description: 'Total de área de vegetação em hectares', example: 200 })
  totalVegetationArea: number;

  @ApiProperty({ description: 'Unidade de medida', example: 'hectares' })
  unit: string;
}

export class ChartDataItem {
  @ApiProperty({ description: 'Nome do item', example: 'SP' })
  name: string;

  @ApiProperty({ description: 'Valor do item', example: 5 })
  value: number;
}

export class ChartResponse {
  @ApiProperty({ description: 'Labels do gráfico', type: 'array', items: { type: 'string' } })
  labels: string[];

  @ApiProperty({ description: 'Dados do gráfico', type: 'array', items: { type: 'number' } })
  data: number[];
}
