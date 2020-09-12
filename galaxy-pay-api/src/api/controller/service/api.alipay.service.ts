import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AliPayDto, AliRefundDto } from "src/common/dtos/pay.dto";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";
import { OrderChannel, OrderStatus, Order } from "src/common/entities/order.entity";
import { SoftwareService } from "src/admin/service/software.service";
import { OrderService } from "src/admin/service/order.service";
import { AlipayBaseBizContent, AlipayConfig } from "src/pay/module/ali/interfaces/base.interface";
import { RefundService } from "src/admin/service/refund.service";

@Injectable()
export class ApiAlipayService {
    constructor(
        private readonly orderService: OrderService,
        private readonly refundService: RefundService,
    ) {
    }

    /**
     * 支付宝订单创建
     * @param alipayConfig
     * @param body 
     */
    public async generateAliOrder(alipayConfig: AlipayConfig, body: AliPayDto) {
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

    /**
     * 支付宝退款
     */
    public async generateAliRefund(alipayConfig: AlipayConfig, body: AliRefundDto) {
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
                    callback_url: alipayConfig.callback_url,
                    return_url: alipayConfig.return_url,
                    notify_url: "https://bkyg-test.utools.club/alipay_refund_notify_url",
                    appid: body.appid
                });
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

}