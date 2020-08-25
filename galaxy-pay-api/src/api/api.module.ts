import { Module, HttpModule, Global } from '@nestjs/common';
import { PayModule } from 'src/pay/pay.module';
import { AdminModule } from 'src/admin/admin.module';
import { ApiAlipayService } from './controller/service/api.alipay.service';
import { ApiWechatService } from './controller/service/api.wechat.service';
import { AlipayController } from './controller/alipay.controller';
import { WechatController } from './controller/wechat.controller';

@Global()
@Module({
  imports: [
    PayModule,
    HttpModule,
    AdminModule
  ],
  controllers: [AlipayController, WechatController],
  providers: [ApiAlipayService, ApiWechatService],
})
export class ApiModule {}
