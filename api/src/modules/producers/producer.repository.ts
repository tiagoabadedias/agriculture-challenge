import { IRepository } from 'src/shared/interfaces/repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProducerDto } from './producer.dto';
import { Producer } from './producer.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ProducerRepository implements IRepository<Producer> {
  constructor(
    @InjectRepository(Producer)
    private readonly repository: Repository<Producer>,
  ) {}

  async create(data: CreateProducerDto): Promise<Producer> {
    const producer = this.repository.create(data as Partial<Producer>);
    return await this.repository.save(producer);
  }

  async findAll(): Promise<Producer[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<Producer> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreateProducerDto>): Promise<Producer> {
    await this.repository.update(id, data as Partial<Producer>);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByDocument(document: string): Promise<Producer> {
    return await this.repository.findOne({ where: { document } });
  }

  async clear(): Promise<void> {
    await this.repository.clear();
  }
}
