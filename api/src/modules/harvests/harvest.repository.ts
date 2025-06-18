import { IRepository } from 'src/shared/interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHarvestDto } from './harvest.dto';
import { Repository, Between } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Harvest } from './harvest.entity';

@Injectable()
export class HarvestRepository implements IRepository<Harvest> {
  constructor(
    @InjectRepository(Harvest)
    private readonly repository: Repository<Harvest>,
  ) {}

  async create(data: CreateHarvestDto): Promise<Harvest> {
    const harvest = this.repository.create(data as Partial<Harvest>);
    return await this.repository.save(harvest);
  }

  async findAll(): Promise<Harvest[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<Harvest> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreateHarvestDto>): Promise<Harvest> {
    await this.repository.update(id, data as Partial<Harvest>);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByYear(harvestYear: number): Promise<Harvest[]> {
    return await this.repository.find({
      where: {
        harvestYear: harvestYear,
      },
    });
  }
}
