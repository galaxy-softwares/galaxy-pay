import { Module } from '@nestjs/common';
import { AliPayModule } from './module/ali/ali.pay.module';
import { WechatPayModule } from './module/wechat/wechat.pay.module';

@Module({
    imports: [
        WechatPayModule,
        AliPayModule
    ],
    exports: [WechatPayModule, AliPayModule]
})
export class PayModule {
}