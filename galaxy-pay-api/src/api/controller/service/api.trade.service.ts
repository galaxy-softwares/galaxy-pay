import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RefundTradeService } from "src/admin/service/refund.trade.service";
import { TradeService } from "src/admin/service/trade.service";
import { AliPayDto, WechatPayDto } from "src/common/dtos/pay.dto";
import { AliPayRefundDto, WechatRefundPayDto } from "src/common/dtos/refund.dto";
import { TradeChannel, TradeStatus } from "src/common/enum/trade.enum";
import { AlipayConfig } from "src/pay/module/ali/interfaces/base.interface";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";


@Injectable()
export class ApiTradeSerivce {

    private channel: TradeChannel;
    constructor(
        private readonly tradeService: TradeService,
        private readonly refundTradeService: RefundTradeService,
    ) {
    }

    /**
     * 支付订单生成
     * @param body WechatPayDto | AliPayDto
     * @param payConfig WechatConfig | AlipayConfig
     * @param withdrawal bool
     */
    public async generateOrder(body: WechatPayDto | AliPayDto, payConfig: WechatConfig | AlipayConfig) {
        try {
            if ((payConfig.appid).substring(0,2) == 'wx') {
                this.channel = TradeChannel.wechat;
            } else {
                this.channel = TradeChannel.alipay;
            }
            await this.tradeService.createTrade({
                appid: body.appid,
                out_trade_no: body.out_trade_no,
                trade_status: TradeStatus.UnPaid,
                callback_url: payConfig.callback_url,
                return_url: payConfig.return_url,
                notify_url: payConfig.notify_url,
                trade_amount: body.money,
                trade_channel: this.channel,
                trade_body: body.body,
            }, this.channel);
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付退款账单生成
     * @param body WechatRefundPayDto | AliPayRefundDto
     * @param payConfig WechatConfig | AlipayConfig
     */
    public async generateRefundOrder(body: WechatRefundPayDto | AliPayRefundDto, payConfig: WechatConfig | AlipayConfig, channel: TradeChannel)  {
        try {
            if ((payConfig.appid).substring(0,2) == 'wx') {
                this.channel = TradeChannel.wechat;
            } else {
                this.channel = TradeChannel.alipay;
            }
            return await this.refundTradeService.createRefdunTrade({
                appid: body.appid,
                out_trade_no: body.out_trade_no,
                trade_status: TradeStatus.UnPaid,
                callback_url: payConfig.callback_url,
                trade_no: '',
                trade_amount: body.money,
                trade_refund_amount: body.refund_money,
                trade_channel: this.channel,
                trade_body: body.body,
            }, this.channel);
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 
     * @param out_trade_no 
     * @param trade_no 
     * @param channel 
     */
    public async refundSuccess(out_trade_no: string, trade_no: string, channel: TradeChannel): Promise<Boolean> {
        return await this.tradeService.refundSuccess(out_trade_no, trade_no, channel)
    }
}