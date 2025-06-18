import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export class FarmResponse {
  @ApiProperty({ description: 'ID da fazenda', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nome da fazenda', example: 'Fazenda São João' })
  name: string;

  @ApiProperty({ description: 'Estado da fazenda (sigla)', example: 'SP', enum: STATES })
  state: string;

  @ApiProperty({ description: 'Cidade da fazenda', example: 'São Paulo' })
  city: string;

  @ApiProperty({ description: 'Área total em hectares', example: 1000 })
  totalArea: number;

  @ApiProperty({
    description: 'Área agricultável em hectares',
    example: 800,
  })
  arableArea: number;

  @ApiProperty({
    description: 'Área de vegetação em hectares',
    example: 200,
  })
  vegetationArea: number;

  @ApiProperty({ description: 'ID do produtor', example: '123e4567-e89b-12d3-a456-426614174000' })
  producerId: string;

  @ApiProperty({ description: 'Data de criação', example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}

export class CreateFarmDto {
  @ApiProperty({ description: 'Nome da fazenda', example: 'Fazenda São João' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Estado da fazenda (sigla)', example: 'SP', enum: STATES })
  @IsString()
  @IsNotEmpty()
  @IsIn(STATES, { message: 'Estado inválido. Use uma sigla válida de estado brasileiro.' })
  state: string;

  @ApiProperty({ description: 'Cidade da fazenda', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Área total em hectares', example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  totalArea: number;

  @ApiProperty({ description: 'Área agricultável em hectares', example: 800 })
  @IsNumber()
  @IsNotEmpty() 
  arableArea: number;

  @ApiProperty({ description: 'Área de vegetação em hectares', example: 200 })
  @IsNumber()
  @IsNotEmpty()
  vegetationArea: number;

  @ApiProperty({ description: 'ID do produtor', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty() 
  producerId: string;
}

export class UpdateFarmDto {
  @ApiProperty({ description: 'Nome da fazenda', example: 'Fazenda São João', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Estado da fazenda (sigla)', example: 'SP', required: false, enum: STATES })
  @IsString()
  @IsOptional()
  @IsIn(STATES, { message: 'Estado inválido. Use uma sigla válida de estado brasileiro.' })
  state?: string;

  @ApiProperty({ description: 'Cidade da fazenda', example: 'São Paulo', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ description: 'Área total em hectares', example: 1000, required: false })
  @IsNumber()
  @IsOptional()
  totalArea?: number;

  @ApiProperty({ description: 'Área agricultável em hectares', example: 800, required: false })
  @IsNumber()
  @IsOptional()
  arableArea?: number;

  @ApiProperty({ description: 'Área de vegetação em hectares', example: 200, required: false })
  @IsNumber()
  @IsOptional()
  vegetationArea?: number;

  @ApiProperty({ description: 'ID do produtor', example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsString()
  @IsOptional()
  producerId?: string;
}
