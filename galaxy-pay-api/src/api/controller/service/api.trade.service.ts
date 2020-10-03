import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { TradeService } from "src/admin/service/trade.service";
import { AliPayDto, AliPayRefundDto, WechatPayDto, WechatRefundPayDto } from "src/common/dtos/pay.dto";
import { Trade } from "src/common/entities/trade.entity";
import { TradeAccountType, TradeChannel, TradeStatus, TradeType } from "src/common/enum/trade.enum";
import { AlipayConfig } from "src/pay/module/ali/interfaces/base.interface";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";


@Injectable()
export class ApiTradeSerivce {

    private channel: TradeChannel;
    constructor(
        private readonly tradeService: TradeService,
    ) {
    }

    /**
     * 支付/提现订单生成
     * @param body WechatPayDto | AliPayDto
     * @param payConfig WechatConfig | AlipayConfig
     * @param withdrawal bool
     */
    public async generateOrder(body: WechatPayDto | AliPayDto, payConfig: WechatConfig | AlipayConfig, trade_type = TradeType.income, trade_account_type = TradeAccountType.payment) {
        try {
            const order = await this.tradeService.findOrder(body.out_trade_no);
            if (order) {
                order.trade_channel = this.channel;
                return await this.tradeService.update(order);
            } else {
                this.createTrade(body, payConfig, trade_type, trade_account_type);
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 创建账单
     * @param body 
     * @param payConfig 
     * @param trade_type 
     * @param trade_account_type 
     */
    private async createTrade(body: WechatPayDto | AliPayDto |  WechatRefundPayDto | AliPayRefundDto, payConfig: WechatConfig | AlipayConfig, trade_type = TradeType.income, trade_account_type = TradeAccountType.payment) {
        if ((payConfig.appid).substring(0,2) == 'wx') {
            this.channel = TradeChannel.wechat;
        } else {
            this.channel = TradeChannel.alipay;
        }
        return await this.tradeService.create({
            appid: body.appid,
            out_trade_no: body.out_trade_no,
            trade_type: trade_type,
            trade_account_type: trade_account_type,
            trade_status: TradeStatus.UnPaid,
            callback_url: payConfig.callback_url,
            return_url: payConfig.return_url,
            notify_url: payConfig.notify_url,
            trade_amount: body.money,
            trade_channel: this.channel,
            trade_body: body.body,
        });
    }

    /**
     * 支付退款账单生成
     * @param body WechatRefundPayDto | AliPayRefundDto
     * @param payConfig WechatConfig | AlipayConfig
     */
    public async generateRefundOrder(body: WechatRefundPayDto | AliPayRefundDto, payConfig: WechatConfig | AlipayConfig)  {
        try {
            // 先判断系统中是否有这个账单并且是支付类型，且已经完成支付。
            const order = await this.tradeService.findOneByWhere({
                trade_no: body.trade_no,
                out_trade_no: body.out_trade_no,
                trade_status: TradeStatus.Success,
                trade_account_type: TradeAccountType.payment
            });
            if (order) {
                return this.createTrade(body, payConfig, TradeType.expenditure, TradeAccountType.refund);
            }
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