import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { TradeService } from 'src/admin/service/trade.service'
import { TradeChannel, TradeStatus, TradeType } from 'src/common/enum/trade.enum'
import { AliPayDto, WechatPayDto } from 'src/admin/dtos/pay.dto'
import { AliPayRefundDto, WechatRefundPayDto } from 'src/admin/dtos/refund.dto'
import { Trade } from 'src/admin/entities'
import { AlipayConfig, WechatConfig } from 'galaxy-pay-config'
import { RefundService } from 'src/admin/service/refund.service'
import { Refund } from 'src/admin/entities/refund.entity'

@Injectable()
export class ApiTradeSerivce {
  private channel: TradeChannel
  constructor(private readonly tradeService: TradeService, private readonly refundService: RefundService) {}

  /**
   * 支付账单生成
   * @param body WechatPayDto | AliPayDto
   * @param payConfig WechatConfig | AlipayConfig
   *
   */
  public async createTrade(body: WechatPayDto | AliPayDto, pay_config: WechatConfig | AlipayConfig) {
    // 这里有点问题
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
   * 创建退款
   * @param body
   * @param pay_config WechatRefundPayDto | AliPayRefundDto,
   * @param trade_channel WechatConfig | AlipayConfig,
   */
  public async createRefund(
    body: WechatRefundPayDto | AliPayRefundDto,
    pay_config: WechatConfig | AlipayConfig
  ): Promise<Trade> {
    const trade = await this.tradeService.findOneByWhere({
      sys_trade_no: body.sys_trade_no,
      trade_status: TradeStatus.Success
    })
    if (trade) {
      await this.refundService.createRefund({
        pay_app_id: body.pay_app_id,
        sys_refund_no: trade.sys_trade_no,
        refund_body: body.body,
        callback_url: pay_config.callback_url,
        return_url: pay_config.return_url,
        notify_url: pay_config.notify_url,
        refund_amount: body.money,
        total_amount: trade.trade_amount,
        refund_channel: trade.trade_channel,
        status: TradeStatus.UnPaid
      })
    } else {
      throw new HttpException('未查询到能够退款得订单，请仔细检查退款订单号！', HttpStatus.BAD_REQUEST)
    }
    return trade
  }

  /**
   * 判断订单是否退款成功！
   * @param sys_trade_no
   * @param sys_transaction_no
   */
  async isRefundSuccessful(sys_trade_no: string, sys_transaction_no: string): Promise<Refund> {
    return await this.refundService.isRefundSuccessful(sys_trade_no, sys_transaction_no)
  }
}
