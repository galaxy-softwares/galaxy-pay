import { Module, HttpModule } from '@nestjs/common';
import { PayModule } from 'src/pay/pay.module';
import { AlipayController } from './controller/alipay.controller';
import { AdminModule } from 'src/admin/admin.module';
import { WechatController } from './controller/wechat.controller';

@Module({
  imports: [
    PayModule,
    HttpModule,
    AdminModule
  ],
  controllers: [AlipayController, WechatController],
  providers: [],
})
export class ApiModule {}
