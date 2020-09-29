import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { OrderService } from "src/admin/service/order.service";
import { RefundService } from "src/admin/service/refund.service";
import { AliPayDto, AliPayRefundDto, WechatPayDto, WechatRefundPayDto } from "src/common/dtos/pay.dto";
import { OrderChannel, OrderStatus } from "src/common/entities/order.entity";
import { AlipayConfig } from "src/pay/module/ali/interfaces/base.interface";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";


@Injectable()
export class ApiOrderSerivce {
    constructor(
        private readonly orderService: OrderService,
        private readonly refundService: RefundService,
    ) {
        
    }

    /**
     * 支付订单生成
     * @param body WechatPayDto | AliPayDto
     * @param payConfig WechatConfig | AlipayConfig
     */
    public async generateOrder(body: WechatPayDto | AliPayDto, payConfig: WechatConfig | AlipayConfig) {
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
                    callback_url: payConfig.callback_url,
                    return_url: payConfig.return_url,
                    notify_url: payConfig.notify_url,
                    appid: body.appid
                });
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付退款订单生成
     * @param body WechatRefundPayDto | AliPayRefundDto
     * @param payConfig WechatConfig | AlipayConfig
     */
    public async generateRefundOrder(body: WechatRefundPayDto | AliPayRefundDto, payConfig: WechatConfig | AlipayConfig)  {
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
                    callback_url: payConfig.callback_url,
                    return_url: payConfig.return_url,
                    notify_url: payConfig.notify_url,
                    appid: body.appid
                });
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}