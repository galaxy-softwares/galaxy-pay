import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import * as serveStatic from 'serve-static';
import path = require('path');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/upload', serveStatic(path.join(__dirname, '../src/upload'), {
    maxAge: '1d',
    extensions: ['p12'],
  }));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3100);
}
bootstrap();
