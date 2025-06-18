import { IRepository } from '../../shared/interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Farm } from './farm.entity';

@Injectable()
export class FarmRepository implements IRepository<Farm> {
  constructor(
    @InjectRepository(Farm)
    private readonly repository: Repository<Farm>,
  ) {}

  async create(farm: Partial<Farm>): Promise<Farm> {
    const newFarm = this.repository.create(farm);
    return this.repository.save(newFarm);
  }

  async findAll(): Promise<Farm[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<Farm> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, farm: Partial<Farm>): Promise<Farm> {
    await this.repository.update(id, farm);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByProducerId(producerId: string): Promise<Farm[]> {
    return await this.repository.find({ where: { producerId } });
  }

  async findByName(name: string): Promise<Farm> {
    return await this.repository.findOne({ where: { name } });
  }
}
