import { Module, HttpModule, Global } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { AlipayController } from './controller/alipay.controller';
import { WechatController } from './controller/wechat.controller';
import { ApiTradeSerivce } from './service/api.trade.service';
import { PayModule } from 'galaxy-pay-config';

@Global()
@Module({
  imports: [PayModule, HttpModule, AdminModule],
  controllers: [AlipayController, WechatController],
  providers: [ApiTradeSerivce],
})
export class ApiModule {}
