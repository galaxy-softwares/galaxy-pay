import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { OrderService } from "src/admin/service/order.service";
import { AliPayDto, AliPayRefundDto, WechatPayDto, WechatRefundPayDto } from "src/common/dtos/pay.dto";
import { OrderChannel, OrderStatus, OrderType } from "src/common/entities/order.entity";
import { AlipayConfig } from "src/pay/module/ali/interfaces/base.interface";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";


@Injectable()
export class ApiOrderSerivce {

    private channel: OrderChannel;
    constructor(
        private readonly orderService: OrderService,
    ) {
    }

    /**
     * 支付/提现订单生成
     * @param body WechatPayDto | AliPayDto
     * @param payConfig WechatConfig | AlipayConfig
     * @param withdrawal bool
     */
    public async generateOrder(body: WechatPayDto | AliPayDto, payConfig: WechatConfig | AlipayConfig, withdrawal = false) {
        if ((payConfig.appid).substring(0,2) == 'wx') {
            this.channel = OrderChannel.wechat;
        } else {
            this.channel = OrderChannel.alipay;
        }
        try {
            const order = await this.orderService.findOrder(body.out_trade_no);
            if (order) {
                order.order_channel = this.channel;
                return await this.orderService.update(order);
            } else {
                return await this.orderService.create({
                    out_trade_no: body.out_trade_no,
                    order_money: body.money,
                    order_channel: this.channel,
                    order_status: OrderStatus.UnPaid,
                    order_type: withdrawal ? OrderType.withdrawal : OrderType.pay,
                    callback_url: payConfig.callback_url,
                    return_url: payConfig.return_url,
                    order_withdrawal_money: withdrawal ? body.money : '',
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
            const order = await this.orderService.findOrder(body.trade_no);
            if (order) {
                order.order_refund_money = (body.refund_money).toString();
                order.order_status = OrderStatus.UnPaid;
                return await this.orderService.update(order);
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}