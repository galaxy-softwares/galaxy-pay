import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { TradeService } from 'src/admin/service/trade.service'
import { TradeChannel, TradeStatus, TradeType } from 'src/common/enum/trade.enum'
import { AliPayDto, WechatPayDto } from 'src/admin/dtos/pay.dto'
import { AliPayRefundDto, WechatRefundPayDto } from 'src/admin/dtos/refund.dto'

import { Trade } from 'src/admin/entities'
import { AlipayConfig, WechatConfig } from 'galaxy-pay-config'

@Injectable()
export class ApiTradeSerivce {
  private channel: TradeChannel
  constructor(private readonly tradeService: TradeService) {}

  /**
   * 支付账单生成
   * @param body WechatPayDto | AliPayDto
   * @param payConfig WechatConfig | AlipayConfig
   *
   */
  public async generateOrder(body: WechatPayDto | AliPayDto, pay_config: WechatConfig | AlipayConfig) {
    if (pay_config.appid.substring(0, 2) == 'wx') {
      this.channel = TradeChannel.wechat
    } else {
      this.channel = TradeChannel.alipay
    }
    await this.tradeService.createTrade({
      pay_app_id: body.pay_app_id,
      sys_trade_no: body.sys_trade_no,
      trade_type: TradeType.Trade,
      refund_trade_no: '',
      trade_status: TradeStatus.UnPaid,
      callback_url: pay_config.callback_url,
      return_url: pay_config.return_url,
      notify_url: pay_config.notify_url,
      trade_amount: body.money,
      trade_channel: this.channel,
      trade_body: body.body,
      sys_transaction_no: ''
    })
  }

  /**
   * 退款账单生成
   * @param body WechatRefundPayDto | AliPayRefundDto
   * @param pay_config WechatConfig | AlipayConfig
   */
  public async generateRefundOrder(
    body: WechatRefundPayDto | AliPayRefundDto,
    pay_config: WechatConfig | AlipayConfig,
    trade_channel: TradeChannel
  ) {
    if (
      this.tradeService.findOneByWhere({
        sys_transaction_no: body.sys_transaction_no,
        trade_status: TradeStatus.Success
      })
    ) {
      await this.tradeService.createTrade({
        pay_app_id: body.pay_app_id,
        sys_trade_no: body.sys_trade_no,
        trade_type: TradeType.Refund,
        refund_trade_no: body.sys_transaction_no, // 只能用 支付订单的 sys_transaction_no ！
        trade_status: TradeStatus.UnPaid,
        callback_url: pay_config.callback_url,
        return_url: pay_config.return_url,
        notify_url: pay_config.notify_url,
        trade_amount: body.money,
        trade_channel: trade_channel,
        trade_body: body.body,
        sys_transaction_no: ''
      })
    } else {
      throw new HttpException('没有查询到能够退款得订单', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 判断订单是否退款成功！
   * @param sys_trade_no
   * @param channel
   * @param sys_transaction_no
   */
  async refundSuccess(sys_trade_no: string, channel: TradeChannel, sys_transaction_no: string): Promise<Trade> {
    return await this.tradeService.refundSuccess(sys_trade_no, channel, sys_transaction_no)
  }
}
