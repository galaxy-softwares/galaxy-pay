import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminModule } from './admin/admin.module';
import { CommonModule } from './common/common.module';
import { ApiModule } from './api/api.module';
import { PayModule } from './pay/pay.module';

@Module({
  imports: [
    HttpModule,
    AdminModule,
    CommonModule,
    PayModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
