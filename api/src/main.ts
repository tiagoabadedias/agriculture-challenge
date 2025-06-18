import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API de Gestão de Fazendas')
    .setDescription('API para gerenciamento de fazendas, produtores e culturas')
    .setVersion('1.0')
    .addTag('Fazendas', 'Endpoints relacionados a fazendas')
    .addTag('Produtores', 'Endpoints relacionados a produtores')
    .addTag('Culturas Plantadas', 'Endpoints relacionados a culturas plantadas')
    .addTag('Colheitas', 'Endpoints relacionados a colheitas')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API de Gestão de Fazendas - Swagger',
  });

  await app.listen(3000);
}
bootstrap();
