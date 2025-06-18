import { HarvestRepository } from './harvest.repository';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './harvest.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest])],
  controllers: [HarvestController],
  providers: [HarvestService, HarvestRepository],
  exports: [HarvestService],
})
export class HarvestModule {}
