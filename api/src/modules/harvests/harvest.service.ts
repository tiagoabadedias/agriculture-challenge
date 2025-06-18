import { CreateHarvestDto, UpdateHarvestDto } from './harvest.dto';
import { CustomLogger } from '../../common/logging/logger.service';
import { HarvestNotFoundException } from './harvest.exception';
import { HarvestRepository } from './harvest.repository';
import { Injectable } from '@nestjs/common';
import { Harvest } from './harvest.entity';

@Injectable()
export class HarvestService {
  constructor(
    private readonly harvestRepository: HarvestRepository,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('HarvestService');
  }

  private async validateHarvestExists(id: string): Promise<void> {
    const harvest = await this.harvestRepository.findById(id);
    if (!harvest) {
      throw new HarvestNotFoundException(id);
    }
  }

  async create(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
   
    const harvest = await this.harvestRepository.create(createHarvestDto);
    
    this.logger.log(`[create] Colheita criada com sucesso - ID: ${harvest.id}`);
    return harvest;
  }

  async findAll(): Promise<Harvest[]> {
    this.logger.log('[findAll] Iniciando busca de todas as colheitas');

    const harvests = await this.harvestRepository.findAll();
    this.logger.log(`[findAll] Busca concluída - Total: ${harvests.length} colheitas`);

    return harvests;
  }

  async findOne(id: string): Promise<Harvest> {
    this.logger.log(`[findOne] Iniciando busca de colheita - ID: ${id}`);

    const harvest = await this.harvestRepository.findById(id);
    if (!harvest) {
      this.logger.warn(`[findOne] Colheita não encontrada - ID: ${id}`);
      throw new HarvestNotFoundException(id);
    }

    this.logger.log(`[findOne] Colheita encontrada - ID: ${id}`);
    return harvest;
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto): Promise<Harvest> {
    this.logger.log(`[update] Iniciando atualização de colheita - ID: ${id}`);

    await this.validateHarvestExists(id);

    const harvest = await this.harvestRepository.update(id, updateHarvestDto);
    this.logger.log(`[update] Colheita atualizada com sucesso - ID: ${id}`);

    return harvest;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`[remove] Iniciando remoção de colheita - ID: ${id}`);

    await this.validateHarvestExists(id);
    await this.harvestRepository.delete(id);
    
    this.logger.log(`[remove] Colheita removida com sucesso - ID: ${id}`);
  }
}
