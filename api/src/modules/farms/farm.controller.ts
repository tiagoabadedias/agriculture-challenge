import { CustomLogger } from '../../common/logging/logger.service'; 'src/common/logging/logger.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ValidateFarmAreas } from './decorators/validate-areas.decorator';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './farm.dto';
import { Farm } from './farm.entity';


@ApiTags('Fazendas')
@Controller('farms')
export class FarmController {
  constructor(
    private readonly farmService: FarmService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('FarmController');
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova fazenda' })
  @ApiBody({ type: CreateFarmDto, description: 'Dados da fazenda a ser criada' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso', type: Farm })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() @ValidateFarmAreas() createFarmDto: CreateFarmDto): Promise<Farm> {
    this.logger.log(`Criando nova fazenda: ${JSON.stringify(createFarmDto)}`);
    const farm = await this.farmService.create(createFarmDto);
    this.logger.log(`Fazenda criada com sucesso: ${farm.id}`);
    return farm;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas retornada com sucesso', type: [Farm] })
  async findAll(): Promise<Farm[]> {
    this.logger.log('Buscando todas as fazendas');
    const farms = await this.farmService.findAll();
    this.logger.log(`Encontradas ${farms.length} fazendas`);
    return farms;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma fazenda pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada com sucesso', type: Farm })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async findOne(@Param('id') id: string): Promise<Farm> {
    this.logger.log(`Buscando fazenda com ID: ${id}`);
    const farm = await this.farmService.findOne(id);
    this.logger.log(`Fazenda encontrada: ${id}`);
    return farm;
  }

  @Get('producer/:producerId')
  @ApiOperation({ summary: 'Buscar fazendas por produtor' })
  @ApiParam({ name: 'producerId', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas do produtor retornada com sucesso', type: [Farm] })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findByProducer(@Param('producerId') producerId: string): Promise<Farm[]> {
    this.logger.log(`Buscando fazendas do produtor: ${producerId}`);
    const farms = await this.farmService.findByProducerId(producerId);
    this.logger.log(`Encontradas ${farms.length} fazendas para o produtor ${producerId}`);
    return farms;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiBody({ type: CreateFarmDto, description: 'Dados da fazenda a ser atualizada' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada com sucesso', type: Farm })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(@Param('id') id: string, @Body() @ValidateFarmAreas() updateFarmDto: Partial<CreateFarmDto>): Promise<Farm> {
    this.logger.log(`Atualizando fazenda ${id}: ${JSON.stringify(updateFarmDto)}`);
    const farm = await this.farmService.update(id, updateFarmDto);
    this.logger.log(`Fazenda ${id} atualizada com sucesso`);
    return farm;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma fazenda' })
  @ApiParam({ name: 'id', description: 'ID da fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Removendo fazenda: ${id}`);
    await this.farmService.remove(id);
    this.logger.log(`Fazenda ${id} removida com sucesso`);
  }
}
