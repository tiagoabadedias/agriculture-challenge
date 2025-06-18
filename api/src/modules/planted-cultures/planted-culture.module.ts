import { PlantedCultureRepository } from './planted-culture.repository';
import { PlantedCultureController } from './planted-culture.controller';
import { PlantedCultureService } from './planted-culture.service';
import { PlantedCulture } from './planted-culture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([PlantedCulture])],
  controllers: [PlantedCultureController],
  providers: [PlantedCultureService, PlantedCultureRepository],
  exports: [PlantedCultureService],
})
export class PlantedCultureModule {}
