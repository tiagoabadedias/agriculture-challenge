import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlantedCultureResponse {
  @ApiProperty({ description: 'ID da cultura plantada', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nome da cultura', example: 'Soja' })
  name: string;

  @ApiProperty({ description: 'Área plantada em hectares', example: 500.5 })
  area: number;

  @ApiProperty({ description: 'ID da fazenda', example: '123e4567-e89b-12d3-a456-426614174000' })
  farmId: string;

  @ApiProperty({ description: 'ID da colheita', example: '123e4567-e89b-12d3-a456-426614174000' })
  harvestId: string;

  @ApiProperty({ description: 'Data de criação', example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}

export class CreatePlantedCultureDto {
  @ApiProperty({ description: 'Nome da cultura', example: 'Soja', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Área plantada em hectares', example: 500.5, required: true })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  area: number;

  @ApiProperty({ description: 'ID da fazenda', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
  @IsUUID()
  @IsNotEmpty()
  farmId: string;

  @ApiProperty({ description: 'ID da colheita', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
  @IsUUID()
  @IsNotEmpty()
  harvestId: string;
}

export class UpdatePlantedCultureDto {
  @ApiProperty({ description: 'Nome da cultura', example: 'Soja', required: false })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ description: 'Área plantada em hectares', example: 500.5, required: false })
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiProperty({ description: 'ID da fazenda', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  farmId?: string;

  @ApiProperty({ description: 'ID da colheita', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsUUID()
  harvestId?: string;
}
