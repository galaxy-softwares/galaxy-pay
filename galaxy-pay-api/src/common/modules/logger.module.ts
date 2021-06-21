import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { LoggerService } from '../service/logger.service'
import { WinstonConfigService } from '../service/winston.service'

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService
    })
  ],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
