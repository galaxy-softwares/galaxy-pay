import { Injectable } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayConfig } from "../interfaces/base.interface";
import { AlipayWapBizContent } from "../interfaces/wap.interface";
import { PayParam } from "src/api/controller/alipay.controller";

@Injectable()
export class AliWapPayService extends AliPayBaseService {
    /**
     * h5 支付
     * 支付宝支付参数拼接
     * @param config AlipayConfig
     * @param body AlipayPageBizContent
     */
    pay(param: PayParam, body: AlipayWapBizContent, config: AlipayConfig): string {
        body.product_code = "QUICK_WAP_WAY";
        const data = {
            appid: config.app_id,
            notify_url: param.notify_url,
            return_url: param.return_url,
            method: "alipay.trade.wap.pay",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...data}
        return this.processParams(this.param, config.private_key);
    }
}