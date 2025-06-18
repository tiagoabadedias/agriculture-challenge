import { IRepository } from 'src/shared/interfaces/repository.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePlantedCultureDto } from './planted-culture.dto';
import { PlantedCulture } from './planted-culture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlantedCultureRepository implements IRepository<PlantedCulture> {
  constructor(
    @InjectRepository(PlantedCulture)
    private readonly repository: Repository<PlantedCulture>,
  ) {}

  async create(data: CreatePlantedCultureDto): Promise<PlantedCulture> {
    try {
      console.log(data);
      const plantedCulture = this.repository.create(data as Partial<PlantedCulture>);
      console.log(plantedCulture);
      return await this.repository.save(plantedCulture);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<PlantedCulture[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<PlantedCulture> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreatePlantedCultureDto>): Promise<PlantedCulture> {
    await this.repository.update(id, data as Partial<PlantedCulture>);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByFarm(farmId: string): Promise<PlantedCulture[]> {
    return await this.repository.find({
      where: { farmId },
    });
  }

  async findByHarvest(harvestId: string): Promise<PlantedCulture[]> {
    return await this.repository.find({
      where: { harvestId },
    });
  }

  async findByName(name: string): Promise<PlantedCulture> {
    return this.repository.findOne({ where: { name } });
  }

  async calculateTotalPlantedArea(farmId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('plantedCulture')
      .select('SUM(plantedCulture.areaUsed)', 'total')
      .where('plantedCulture.farmId = :farmId', { farmId })
      .getRawOne();

    return result?.total || 0;
  }
}
