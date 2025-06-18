import { IsString, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { IsValidDocument } from './validators/document.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @ApiProperty({ description: 'Nome do produtor', example: 'João Silva', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'CPF ou CNPJ do produtor (apenas números)', example: '02405315076', required: true })
  @IsString()
  @IsNotEmpty()
  @IsValidDocument()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'O documento deve conter 11 dígitos para CPF ou 14 dígitos para CNPJ',
  })
  document: string;
}

export class UpdateProducerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  document?: string;
}

export class ProducerResponse {
  @ApiProperty({ description: 'ID do produtor', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nome do produtor', example: 'João Silva' })
  name: string;

  @ApiProperty({ description: 'Documento do produtor (CPF/CNPJ)', example: '12345678900' })
  document: string;

  @ApiProperty({ description: 'Data de criação', example: '2024-03-20T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-03-20T10:00:00Z' })
  updatedAt: Date;
}
