import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class HarvestResponse {
  @ApiProperty({ description: 'ID da colheita', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nome da colheita', example: 'Colheita de Soja 2024' })
  name: string;

  @ApiProperty({ description: 'Ano da colheita', example: '2024' })
  harvestYear: number;

  @ApiProperty({ description: 'Data de criação', example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}

export class CreateHarvestDto {
  @ApiProperty({ description: 'Nome da colheita', example: 'Colheita de Soja 2024' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Ano da colheita', example: '2024' })
  @IsNumber()
  @IsNotEmpty()
  harvestYear: number;

}

export class UpdateHarvestDto {
  @ApiProperty({ description: 'Nome da colheita', example: 'Colheita de Soja 2024', required: false })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Ano da colheita', example: '2024', required: false })
  @IsNumber()
  @IsNotEmpty()
  harvestYear?: number;
}
