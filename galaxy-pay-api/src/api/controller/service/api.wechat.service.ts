import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AliPayDto, WechatPayDto } from "src/common/dtos/pay.dto";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";
import { OrderChannel, OrderStatus } from "src/common/entities/order.entity";
import { SoftwareService } from "src/admin/service/software.service";
import { OrderService } from "src/admin/service/order.service";

@Injectable()
export class ApiWechatService {
    constructor(
        private readonly softwareService: SoftwareService,
        private readonly orderService: OrderService,
    ) {
    }

    /**
     * 微信支付订单创建
     * @param alipayConfig 
     * @param body 
     */
    public async generateWechatOrder(body: WechatPayDto, alipayConfig: WechatConfig) {
        try {
            const order = await this.orderService.findOrder(body.out_trade_no);
            if (order) {
                order.order_channel = OrderChannel.alipay;
                return await this.orderService.update(order);
            } else {
                return await this.orderService.create({
                    out_trade_no: body.out_trade_no,
                    order_money: body.money,
                    order_channel: OrderChannel.alipay,
                    order_status: OrderStatus.UnPaid,
                    callback_url: alipayConfig.callback_url,
                    return_url: alipayConfig.return_url,
                    notify_url: alipayConfig.notify_url,
                    appid: body.appid
                });
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

}