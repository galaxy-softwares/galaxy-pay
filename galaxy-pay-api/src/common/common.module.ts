import { Module, Global } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ValidationPipe } from './pipe/validation.pipe';
import { LoggerService } from './service/logger.service';
import { WinstonConfigService } from './service/winston.service';
import { TimeUtil } from './utils/time.util';

@Global()
@Module({
    imports: [
        WinstonModule.forRootAsync({
            useClass: WinstonConfigService,
        }),
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        LoggerService,
        TimeUtil,
    ],
    exports: [LoggerService],
})
export class CommonModule {}