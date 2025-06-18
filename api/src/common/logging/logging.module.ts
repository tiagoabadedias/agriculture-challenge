import { CustomLogger } from '../../common/logging/logger.service'; './logger.service';
import { LoggingInterceptor } from './logging.interceptor';
import { winstonConfig } from './winston.config';
import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  providers: [
    CustomLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [CustomLogger],
})
export class LoggingModule {} 