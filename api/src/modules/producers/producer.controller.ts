import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CustomLogger } from '../../common/logging/logger.service';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './producer.dto';
import { Producer } from './producer.entity';

@ApiTags('Produtores')
@Controller('producers')
export class ProducerController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('ProducerController');
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produtor' })
  @ApiBody({ type: CreateProducerDto, description: 'Dados do produtor a ser criado' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso', type: Producer })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createProducerDto: CreateProducerDto): Promise<Producer> {
    this.logger.log(`Criando novo produtor: ${JSON.stringify(createProducerDto)}`);
    const producer = await this.producerService.create(createProducerDto);
    this.logger.log(`Produtor criado com sucesso: ${producer.id}`);
    return producer;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso', type: [Producer] })
  async findAll(): Promise<Producer[]> {
    this.logger.log('Buscando todos os produtores');
    const producers = await this.producerService.findAll();
    this.logger.log(`Encontrados ${producers.length} produtores`);
    return producers;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produtor pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado com sucesso', type: Producer })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findOne(@Param('id') id: string): Promise<Producer> {
    this.logger.log(`Buscando produtor com ID: ${id}`);
    const producer = await this.producerService.findById(id);
    this.logger.log(`Produtor encontrado: ${id}`);
    return producer;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produtor' })
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiBody({ type: CreateProducerDto, description: 'Dados do produtor a ser atualizado' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado com sucesso', type: Producer })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(@Param('id') id: string, @Body() updateProducerDto: Partial<CreateProducerDto>): Promise<Producer> {
    this.logger.log(`Atualizando produtor ${id}: ${JSON.stringify(updateProducerDto)}`);
    const producer = await this.producerService.update(id, updateProducerDto);
    this.logger.log(`Produtor ${id} atualizado com sucesso`);
    return producer;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produtor' })
  @ApiParam({ name: 'id', description: 'ID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Removendo produtor: ${id}`);
    await this.producerService.delete(id);
    this.logger.log(`Produtor ${id} removido com sucesso`);
  }
}
