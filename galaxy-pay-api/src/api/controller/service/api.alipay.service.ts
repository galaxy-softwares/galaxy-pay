import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PayDto } from "src/common/dtos/pay.dto";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";
import { OrderChannel, OrderStatus } from "src/common/entities/order.entity";
import { SoftwareService } from "src/admin/service/software.service";
import { OrderService } from "src/admin/service/order.service";
import { AlipayBaseBizContent, AlipayConfig } from "src/pay/module/ali/interfaces/base.interface";

@Injectable()
export class ApiAlipayService {
    constructor(
        private readonly softwareService: SoftwareService,
        private readonly orderService: OrderService,
    ) {
    }

    /**
     * 生成支付宝所需的配置参数
     * @param appid 
     */
    public async generateAliPay(param: PayDto, body: AlipayBaseBizContent):Promise<AlipayConfig>  {
        try {
            const software = await this.softwareService.findSoftwarePay(param.appid, OrderChannel.alipay)
            const order = await this.orderService.findOrder(body.out_trade_no, OrderChannel.alipay)
            const alipayConfig: AlipayConfig =  JSON.parse(software.alipay);
            if(alipayConfig) {
                if (param.notify_url !== '') {
                    alipayConfig.notify_url = param.notify_url;
                }
                if (param.return_url !== '') {
                    alipayConfig.return_url = param.return_url;
                }
                if (order) {
                    return alipayConfig;
                } else {
                    if (await this.orderService.create({
                        out_trade_no: body.out_trade_no,
                        order_money: body.total_amount,
                        order_channel: OrderChannel.alipay,
                        order_status: OrderStatus.UnPaid,
                        callback_url: param.callback_url,
                        return_url: param.return_url,
                        notify_url: param.notify_url,
                        appid: param.appid
                    })) {
                        return alipayConfig;
                    }
                }
            }
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

}