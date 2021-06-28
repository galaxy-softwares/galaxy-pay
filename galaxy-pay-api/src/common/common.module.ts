import { Module, Global } from '@nestjs/common'
import { AllExceptionsFilter } from './filters/all-exception.filter'
import { HttpExceptionFilter } from './filters/http.exception.filter'
import { ResponseInterceptor } from './interceptor/response.interceptor'
import { GapConfigModule } from './modules/config.module'
import { DatabaseModule } from './modules/database.module'
import { LoggerModule } from './modules/logger.module'
import { ValidationPipe } from './pipe/validation.pipe'
import { LoggerService } from './service/logger.service'
import { TimeUtil } from './utils/time.util'

@Global()
@Module({
  imports: [DatabaseModule, GapConfigModule, LoggerModule],
  providers: [ValidationPipe, LoggerService, HttpExceptionFilter, AllExceptionsFilter, ResponseInterceptor, TimeUtil],
  exports: [LoggerService]
})
export class CommonModule {}
