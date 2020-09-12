import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { WechatPayDto, WechatRefundPayDto } from "src/common/dtos/pay.dto";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";
import { OrderChannel, OrderStatus } from "src/common/entities/order.entity";
import { OrderService } from "src/admin/service/order.service";
import { RefundService } from "src/admin/service/refund.service";

@Injectable()
export class ApiWechatService {
    constructor(
        private readonly orderService: OrderService,
        private readonly refundService: RefundService,
    ) {
    }

    /**
     * 微信支付订单创建
     * @param wechatConfig 
     * @param body 
     */
    public async generateWechatOrder(body: WechatPayDto, wechatConfig: WechatConfig) {
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
                    callback_url: wechatConfig.callback_url,
                    return_url: wechatConfig.return_url,
                    notify_url: wechatConfig.notify_url,
                    appid: body.appid
                });
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }


    /**
     * 支付宝退款
     */
    public async generateWechatRefund(body: WechatRefundPayDto, wechatConfig: WechatConfig,) {
        try {
            const order = await this.refundService.findOrder(body.trade_no);
            if (order) {
                order.order_channel = OrderChannel.alipay;
                return await this.refundService.update(order);
            } else {
                return await this.refundService.create({
                    out_trade_no: body.trade_no,
                    order_money: body.money,
                    refund_money: body.refund_money,
                    order_channel: OrderChannel.alipay,
                    order_status: OrderStatus.UnPaid,
                    callback_url: wechatConfig.callback_url,
                    return_url: wechatConfig.return_url,
                    notify_url: wechatConfig.notify_url,
                    appid: body.appid
                });
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}