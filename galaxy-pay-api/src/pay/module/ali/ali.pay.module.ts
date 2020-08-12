import { Module, HttpModule } from '@nestjs/common';
import { AliWapPayService } from './service/wap.pay.service';
import { AliParamsUtil } from './util/params.util';
import { AliRequestUtil } from './util/request.util';
import { AliSignUtil } from './util/sign.util';
import { AliAppPayService } from './service/app.pay.service';
import { AliPagePayService } from './service/page.pay.service';
import { AliTradePayService } from './service/trade.pay.service';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [
       AliWapPayService,
       AliPagePayService,
       AliAppPayService,
       AliParamsUtil,
       AliRequestUtil,
       AliSignUtil,
       AliTradePayService,
    ],
    exports: [
       AliWapPayService,
       AliPagePayService,
       AliAppPayService,
       AliParamsUtil,
       AliRequestUtil,
       AliSignUtil,
       AliTradePayService,
    ]
})
export class AliPayModule {
}
