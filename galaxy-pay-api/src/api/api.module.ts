import { Module, HttpModule, Global } from '@nestjs/common';
import { PayModule } from 'src/pay/pay.module';
import { AdminModule } from 'src/admin/admin.module';
import { AlipayController } from './controller/alipay.controller';
import { WechatController } from './controller/wechat.controller';
import { TransformService } from './service/transform.service';
import { ApiTradeSerivce } from './service/api.trade.service';

@Global()
@Module({
  imports: [PayModule, HttpModule, AdminModule],
  controllers: [AlipayController, WechatController],
  providers: [TransformService, ApiTradeSerivce],
})
export class ApiModule {}
