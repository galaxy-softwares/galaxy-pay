import { Injectable } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayConfig } from "../interfaces/base.interface";
import { AlipayPageBizContent } from "../interfaces/page.interface";

@Injectable()
export class AliPagePayService extends AliPayBaseService {

    /**
     * 
     * 支付宝pc支付
     * @param param AlipayRequestParam
     * @param data AlipayPageBizContent
     * @param config AlipayConfig
     */
    pay(config: AlipayConfig, body: AlipayPageBizContent){
        body.product_code = "FAST_INSTANT_TRADE_PAY";
        const param = {
            method: "alipay.trade.page.pay",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...param}
        return this.processParams(this.param, config);
    }
}