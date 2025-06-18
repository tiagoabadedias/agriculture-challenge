import { PlantedCultureModule } from './modules/planted-cultures/planted-culture.module';
import { ExceptionsModule } from './common/exceptions/exceptions.module';
import { ProducerModule } from './modules/producers/producer.module';
import { HarvestModule } from './modules/harvests/harvest.module';
import { LoggingModule } from './common/logging/logging.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';
import { FarmModule } from './modules/farms/farm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    LoggingModule,
    ExceptionsModule,
    ProducerModule,
    FarmModule,
    PlantedCultureModule,
    HarvestModule,
  ]
})
export class AppModule {}
