import { Injectable } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayConfig } from "../interfaces/base.interface";
import { AlipayAppBizContent } from "../interfaces/app.interface";
import { PayParam } from "src/api/controller/alipay.controller";

@Injectable()
export class AliAppPayService extends AliPayBaseService {

    /**
     * 支付宝app 服务端支付
     * @param config AlipayConfig
     * @param data
     */
    async pay(param: PayParam, body: AlipayAppBizContent, config: AlipayConfig): Promise<any> {
        body.product_code = "QUICK_MSECURITY_PAY";
        const data = {
            app_id: config.app_id,
            notify_url: param.notify_url,
            method: "alipay.trade.app.pay",
            biz_content: JSON.stringify({
                ...body
            }),
        }
        this.param = {...this.param, ...data}
        return this.processParams(this.param, config.private_key);
    }
}