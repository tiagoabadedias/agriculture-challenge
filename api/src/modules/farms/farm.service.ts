import { FarmNotFoundException, InvalidFarmAreaException } from './farm.exception';
import { ProducerNotFoundException } from '../producers/producer.exception';
import { CustomLogger } from '../../common/logging/logger.service';
import { CreateFarmDto, UpdateFarmDto } from './farm.dto';
import { Producer } from '../producers/producer.entity';
import { FarmRepository } from './farm.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Farm } from './farm.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FarmService {
  constructor(
    private readonly farmRepository: FarmRepository,
    @InjectRepository(Producer)
    private readonly producerRepository: Repository<Producer>,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('FarmService');
  }

  private validateAreas(data: Partial<CreateFarmDto>, existingFarm?: Farm): void {
    const totalArea = data.totalArea ?? existingFarm?.totalArea;
    const arableArea = data.arableArea ?? existingFarm?.arableArea;
    const vegetationArea = data.vegetationArea ?? existingFarm?.vegetationArea;

    if (totalArea && arableArea && vegetationArea) {
      const sum = Number(arableArea) + Number(vegetationArea);
      if (sum > Number(totalArea)) {
        throw new InvalidFarmAreaException(totalArea);
      }
    }
  }

  private async validateProducerExists(producerId: string): Promise<void> {
    const producer = await this.producerRepository.findOne({ where: { id: producerId } });
    if (!producer) {
      throw new ProducerNotFoundException(producerId);
    }
  }

  private async validateFarmExists(id: string): Promise<void> {
    const farm = await this.farmRepository.findById(id);
    if (!farm) {
      throw new FarmNotFoundException(id);
    }
  }

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    this.logger.log(`[create] Iniciando criação de fazenda - Área total: ${createFarmDto.totalArea}`);

    await this.validateProducerExists(createFarmDto.producerId);
    this.validateAreas(createFarmDto);
    const farm = await this.farmRepository.create(createFarmDto);
    
    this.logger.log(`[create] Fazenda criada com sucesso - ID: ${farm.id}`);
    return farm;
  }

  async findAll(): Promise<Farm[]> {
    this.logger.log('[findAll] Iniciando busca de todas as fazendas');

    const farms = await this.farmRepository.findAll();
    this.logger.log(`[findAll] Busca concluída - Total: ${farms.length} fazendas`);

    return farms;
  }

  async findOne(id: string): Promise<Farm> {
    this.logger.log(`[findOne] Iniciando busca de fazenda - ID: ${id}`);

    const farm = await this.farmRepository.findById(id);
    if (!farm) {
      this.logger.warn(`[findOne] Fazenda não encontrada - ID: ${id}`);
      throw new FarmNotFoundException(id);
    }

    this.logger.log(`[findOne] Fazenda encontrada - ID: ${id}`);
    return farm;
  }

  async findByProducerId(producerId: string): Promise<Farm[]> {
    this.logger.log(`[findByProducerId] Iniciando busca de fazendas por produtor - ProducerID: ${producerId}`);

    await this.validateProducerExists(producerId);
    const farms = await this.farmRepository.findByProducerId(producerId);
    this.logger.log(`[findByProducerId] Busca concluída - Total: ${farms.length} fazendas`);

    return farms;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    this.logger.log(`[update] Iniciando atualização de fazenda - ID: ${id}`);

    await this.validateFarmExists(id);
    if (updateFarmDto.producerId) {
      await this.validateProducerExists(updateFarmDto.producerId);
    }
    this.validateAreas(updateFarmDto);

    const farm = await this.farmRepository.update(id, updateFarmDto);
    this.logger.log(`[update] Fazenda atualizada com sucesso - ID: ${id}`);

    return farm;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`[remove] Iniciando remoção de fazenda - ID: ${id}`);

    await this.validateFarmExists(id);
    await this.farmRepository.delete(id);
    
    this.logger.log(`[remove] Fazenda removida com sucesso - ID: ${id}`);
  }
}
