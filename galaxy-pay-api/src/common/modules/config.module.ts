import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from '../configs/database';
import LoggerConfig from '../configs/logger';
import * as validation from '../configs/validation';
import { GpaConfigService } from '../service/config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        DatabaseConfig,
        LoggerConfig,
      ],
      expandVariables: true,
      validationSchema: validation.schema,
      validationOptions: validation.options
    }),
  ],
  providers: [
    ConfigService,
    GpaConfigService,
  ],
  exports: [
    ConfigService,
    GpaConfigService,
  ],
})
export class GapConfigModule {}
