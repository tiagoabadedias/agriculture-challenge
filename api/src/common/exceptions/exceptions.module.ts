import { HttpExceptionFilter } from './http-exception.filter';
import { winstonConfig } from '../logging/winston.config';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class ExceptionsModule {} 