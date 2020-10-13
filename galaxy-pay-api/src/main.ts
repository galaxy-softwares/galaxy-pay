import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { LoggerService } from './common/service/logger.service';
import { createLogger } from 'winston';
import { WinstonConfigService } from './common/service/winston.service';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { TimeUtil } from './common/utils/time.util';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = dotenv.parse(fs.readFileSync('.env'));
  const loggerService = new LoggerService(createLogger(new WinstonConfigService().createWinstonModuleOptions()));
  const timeUtil = new TimeUtil;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // 全局拦截器
  app.useGlobalInterceptors(
    new ResponseInterceptor(loggerService),
  );
  app.useGlobalFilters(new AllExceptionsFilter(timeUtil, loggerService), new HttpExceptionFilter(timeUtil, loggerService));
  await app.listen(config.PORT);
}
bootstrap();
