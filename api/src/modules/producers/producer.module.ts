import { ProducerRepository } from './producer.repository';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './producer.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducerController],
  providers: [ProducerService, ProducerRepository],
  exports: [ProducerService],
})
export class ProducerModule {}
