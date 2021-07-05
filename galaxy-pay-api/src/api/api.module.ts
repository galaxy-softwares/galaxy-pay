import { Module, HttpModule, Global } from '@nestjs/common'
import { PayModule } from 'galaxy-pay-config'
import { AdminModule } from 'src/admin/admin.module'
import { AlipayController } from './controller/alipay.controller'
import { WechatController } from './controller/wechat.controller'
import { ApiPayappSerivce } from './service/api.payapp.service'
import { ApiTradeSerivce } from './service/api.trade.service'

@Global()
@Module({
  imports: [PayModule, HttpModule, AdminModule],
  controllers: [AlipayController, WechatController],
  providers: [ApiTradeSerivce, ApiPayappSerivce],
  exports: [ApiPayappSerivce]
})
export class ApiModule {}
