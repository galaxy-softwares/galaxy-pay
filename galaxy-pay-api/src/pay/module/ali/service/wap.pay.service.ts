import { Injectable } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayConfig } from "../interfaces/base.interface";
import { AlipayWapBizContent } from "../interfaces/wap.interface";

@Injectable()
export class AliWapPayService extends AliPayBaseService {

    /**
     * h5 支付
     * 支付宝支付参数拼接
     * @param config AlipayConfig
     * @param body AlipayPageBizContent
     */
    pay(config: AlipayConfig, body: AlipayWapBizContent): string {
        body.product_code = "QUICK_WAP_WAY";
        const param = {
            method: "alipay.trade.wap.pay",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...param}
        return this.processParams(this.param, config);
    }
}