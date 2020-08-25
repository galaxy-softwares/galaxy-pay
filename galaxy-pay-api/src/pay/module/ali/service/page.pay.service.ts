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
    pay(body: AlipayPageBizContent, config: AlipayConfig){
        body.product_code = "FAST_INSTANT_TRADE_PAY";
        const data = {
            app_id: config.app_id,
            notify_url: config.notify_url,
            return_url: config.return_url,
            method: "alipay.trade.page.pay",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...data}
        return this.processParams(this.param, config.private_key);
    }
}