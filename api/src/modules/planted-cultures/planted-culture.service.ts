import { InvalidPlantedAreaException, PlantedCultureNotFoundException } from './invalid-planted-area.exception';
import { CustomLogger } from '../../common/logging/logger.service'; 'src/common/logging/logger.service';
import { CreatePlantedCultureDto, UpdatePlantedCultureDto } from './planted-culture.dto';
import { PlantedCultureRepository } from './planted-culture.repository';
import { PlantedCulture } from './planted-culture.entity';
import { Injectable } from '@nestjs/common';


@Injectable()
export class PlantedCultureService {
  constructor(
    private readonly plantedCultureRepository: PlantedCultureRepository,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('PlantedCultureService');
  }

  private validatePlantedArea(area: number): void {
    if (area <= 0) {
      throw new InvalidPlantedAreaException(area);
    }
  }

  private async validatePlantedCultureExists(id: string): Promise<void> {
    const culture = await this.plantedCultureRepository.findById(id);
    if (!culture) {
      throw new PlantedCultureNotFoundException(id);
    }
  }

  async create(createPlantedCultureDto: CreatePlantedCultureDto): Promise<PlantedCulture> {
    this.logger.log(`[create] Iniciando criação de cultura plantada - Área: ${createPlantedCultureDto.area}`);

    this.validatePlantedArea(createPlantedCultureDto.area);
    const culture = await this.plantedCultureRepository.create(createPlantedCultureDto);
    
    this.logger.log(`[create] Cultura plantada criada com sucesso - ID: ${culture.id}`);

    return culture;
  }

  async findAll(): Promise<PlantedCulture[]> {
    this.logger.log('[findAll] Iniciando busca de todas as culturas plantadas');

    const cultures = await this.plantedCultureRepository.findAll();
    this.logger.log(`[findAll] Busca concluída - Total: ${cultures.length} culturas`);

    return cultures;
  }

  async findOne(id: string): Promise<PlantedCulture> {
    this.logger.log(`[findOne] Iniciando busca de cultura plantada - ID: ${id}`);

    const culture = await this.plantedCultureRepository.findById(id);
    if (!culture) {
      this.logger.warn(`[findOne] Cultura plantada não encontrada - ID: ${id}`);
      throw new PlantedCultureNotFoundException(id);
    }

    this.logger.log(`[findOne] Cultura plantada encontrada - ID: ${id}`);
    return culture;
  }

  async findByFarmId(farmId: string): Promise<PlantedCulture[]> {
    this.logger.log(`[findByFarmId] Iniciando busca de culturas por fazenda - FarmID: ${farmId}`);

    const cultures = await this.plantedCultureRepository.findByFarm(farmId);
    this.logger.log(`[findByFarmId] Busca concluída - Total: ${cultures.length} culturas`);

    return cultures;
  }

  async findByHarvestId(harvestId: string): Promise<PlantedCulture[]> {
    this.logger.log(`[findByHarvestId] Iniciando busca de culturas por colheita - HarvestID: ${harvestId}`);

    const cultures = await this.plantedCultureRepository.findByHarvest(harvestId);
    this.logger.log(`[findByHarvestId] Busca concluída - Total: ${cultures.length} culturas`);

    return cultures;
  }

  async update(id: string, updatePlantedCultureDto: UpdatePlantedCultureDto): Promise<PlantedCulture> {
    this.logger.log(`[update] Iniciando atualização de cultura plantada - ID: ${id}`);

    await this.validatePlantedCultureExists(id);

    if (updatePlantedCultureDto.area) {
      this.validatePlantedArea(updatePlantedCultureDto.area);
    }

    const culture = await this.plantedCultureRepository.update(id, updatePlantedCultureDto);
    this.logger.log(`[update] Cultura plantada atualizada com sucesso - ID: ${id}`);

    return culture;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`[remove] Iniciando remoção de cultura plantada - ID: ${id}`);

    await this.validatePlantedCultureExists(id);
    await this.plantedCultureRepository.delete(id);
    
    this.logger.log(`[remove] Cultura plantada removida com sucesso - ID: ${id}`);
  }
}
