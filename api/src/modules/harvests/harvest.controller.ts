import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateHarvestDto, HarvestResponse, UpdateHarvestDto } from './harvest.dto';
import { CustomLogger } from '../../common/logging/logger.service';
import { HarvestService } from './harvest.service';

@ApiTags('Colheitas')
@Controller('harvests')
export class HarvestController {
  constructor(
    private readonly harvestService: HarvestService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('HarvestController');
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova colheita' })
  @ApiBody({ type: CreateHarvestDto, description: 'Dados da colheita a ser criada' })
  @ApiResponse({ status: 201, description: 'Colheita criada com sucesso', type: HarvestResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    createHarvestDto: CreateHarvestDto,
  ): Promise<HarvestResponse> {
    this.logger.log(`Criando nova colheita: ${JSON.stringify(createHarvestDto)}`);
    try {
      const harvest = await this.harvestService.create(createHarvestDto);
      this.logger.log(`Colheita criada com sucesso: ${harvest.id}`);
      return harvest;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as colheitas' })
  @ApiResponse({ status: 200, description: 'Lista de colheitas', type: [HarvestResponse] })
  async findAll(): Promise<HarvestResponse[]> {
    this.logger.log('Buscando todas as colheitas');
    const harvests = await this.harvestService.findAll();
    this.logger.log(`Encontradas ${harvests.length} colheitas`);
    return harvests;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma colheita pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da colheita' })
  @ApiResponse({ status: 200, description: 'Colheita encontrada', type: HarvestResponse })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada' })
  async findOne(@Param('id') id: string): Promise<HarvestResponse> {
    this.logger.log(`Buscando colheita com ID: ${id}`);
    const harvest = await this.harvestService.findOne(id);
    this.logger.log(`Colheita encontrada: ${id}`);
    return harvest;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma colheita' })
  @ApiResponse({ status: 200, description: 'Colheita atualizada com sucesso', type: HarvestResponse })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos' })
  async update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto): Promise<HarvestResponse> {
    this.logger.log(`Atualizando colheita ${id}: ${JSON.stringify(updateHarvestDto)}`);
    const harvest = await this.harvestService.update(id, updateHarvestDto);
    this.logger.log(`Colheita ${id} atualizada com sucesso`);
    return harvest;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma colheita' })
  @ApiParam({ name: 'id', description: 'ID da colheita' })
  @ApiResponse({ status: 200, description: 'Colheita removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Removendo colheita: ${id}`);
    await this.harvestService.remove(id);
    this.logger.log(`Colheita ${id} removida com sucesso`);
  }
}
