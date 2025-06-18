import { PlantedCulture } from '../planted-cultures/planted-culture.entity';
import { FarmReportController } from './reports/farm-report.controller';
import { FarmReportService } from './reports/farm-report.service';
import { Producer } from '../producers/producer.entity';
import { FarmController } from './farm.controller';
import { FarmRepository } from './farm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmService } from './farm.service';
import { Module } from '@nestjs/common';
import { Farm } from './farm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, PlantedCulture, Producer])],
  controllers: [FarmController, FarmReportController],
  providers: [FarmService, FarmReportService, FarmRepository],
  exports: [FarmService],
})
export class FarmModule {}
