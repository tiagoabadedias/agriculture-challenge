import { Controller, Get, Post, Body, Param, Put, Delete, ValidationPipe } from '@nestjs/common';
import { CreatePlantedCultureDto, UpdatePlantedCultureDto } from './planted-culture.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CustomLogger } from '../../common/logging/logger.service';
import { PlantedCultureService } from './planted-culture.service';
import { PlantedCulture } from './planted-culture.entity';

@ApiTags('Culturas Plantadas')
@Controller('planted-cultures')
export class PlantedCultureController {
  constructor(
    private readonly plantedCultureService: PlantedCultureService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('PlantedCultureController');
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova cultura plantada' })
  @ApiBody({ type: CreatePlantedCultureDto, description: 'Dados da cultura plantada a ser criada' })
  @ApiResponse({ status: 201, description: 'Cultura plantada criada com sucesso', type: CreatePlantedCultureDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    createPlantedCultureDto: CreatePlantedCultureDto,
  ): Promise<PlantedCulture> {
    this.logger.log(`Criando nova cultura plantada: ${JSON.stringify(createPlantedCultureDto)}`);
    
    const plantedCulture = await this.plantedCultureService.create(createPlantedCultureDto);
    this.logger.log(`Cultura plantada criada com sucesso: ${plantedCulture.id}`);
    return plantedCulture;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as culturas plantadas' })
  @ApiResponse({ status: 200, description: 'Lista de culturas plantadas retornada com sucesso', type: [CreatePlantedCultureDto] })
  async findAll(): Promise<PlantedCulture[]> {
    this.logger.log('Buscando todas as culturas plantadas');
    
    const plantedCultures = await this.plantedCultureService.findAll();
    this.logger.log(`Encontradas ${plantedCultures.length} culturas plantadas`);
    return plantedCultures;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma cultura plantada pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da cultura plantada' })
  @ApiResponse({ status: 200, description: 'Cultura plantada encontrada com sucesso', type: CreatePlantedCultureDto })
  @ApiResponse({ status: 404, description: 'Cultura plantada não encontrada' })
  async findOne(@Param('id') id: string): Promise<PlantedCulture> {
    this.logger.log(`Buscando cultura plantada com ID: ${id}`);
    
    const plantedCulture = await this.plantedCultureService.findOne(id);
    this.logger.log(`Cultura plantada encontrada: ${id}`);
    return plantedCulture;
  }

  @Get('harvest/:harvestId')
  @ApiOperation({ summary: 'Buscar culturas plantadas por ID da colheita' })
  @ApiParam({ name: 'harvestId', description: 'ID da colheita' })
  @ApiResponse({ status: 200, description: 'Lista de culturas plantadas retornada com sucesso', type: [CreatePlantedCultureDto] })
  async findByHarvest(@Param('harvestId') harvestId: string): Promise<PlantedCulture[]> {
    this.logger.log(`Buscando culturas plantadas da colheita: ${harvestId}`);
    
    const plantedCultures = await this.plantedCultureService.findByHarvestId(harvestId);
    this.logger.log(`Encontradas ${plantedCultures.length} culturas plantadas para a colheita ${harvestId}`);
    return plantedCultures;
  }

  @Get('farm/:farmId')
  @ApiOperation({ summary: 'Buscar culturas plantadas por ID da fazenda' })
  @ApiParam({ name: 'farmId', description: 'ID da fazenda' })
  @ApiResponse({ status: 200, description: 'Lista de culturas plantadas retornada com sucesso', type: [CreatePlantedCultureDto] })
  async findByFarm(@Param('farmId') farmId: string): Promise<PlantedCulture[]> {
    this.logger.log(`Buscando culturas plantadas da fazenda: ${farmId}`);
    
    const plantedCultures = await this.plantedCultureService.findByFarmId(farmId);
    this.logger.log(`Encontradas ${plantedCultures.length} culturas plantadas para a fazenda ${farmId}`);
    return plantedCultures;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma cultura plantada' })
  @ApiParam({ name: 'id', description: 'ID da cultura plantada' })
  @ApiBody({ type: UpdatePlantedCultureDto, description: 'Dados da cultura plantada a ser atualizada' })
  @ApiResponse({ status: 200, description: 'Cultura plantada atualizada com sucesso', type: CreatePlantedCultureDto })
  @ApiResponse({ status: 404, description: 'Cultura plantada não encontrada' })
  async update(@Param('id') id: string, @Body() updatePlantedCultureDto: UpdatePlantedCultureDto): Promise<PlantedCulture> {
    this.logger.log(`Atualizando cultura plantada ${id}: ${JSON.stringify(updatePlantedCultureDto)}`);
    
    const plantedCulture = await this.plantedCultureService.update(id, updatePlantedCultureDto);
    this.logger.log(`Cultura plantada ${id} atualizada com sucesso`);
    return plantedCulture;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma cultura plantada' })
  @ApiParam({ name: 'id', description: 'ID da cultura plantada' })
  @ApiResponse({ status: 200, description: 'Cultura plantada removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Cultura plantada não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Removendo cultura plantada: ${id}`);
    
    await this.plantedCultureService.remove(id);
    this.logger.log(`Cultura plantada ${id} removida com sucesso`);
  }
}
