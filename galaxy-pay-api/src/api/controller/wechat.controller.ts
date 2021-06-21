import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { PayConfig } from 'src/common/decorator/pay.config.decorator'
import { PayGuard } from 'src/common/guard/pay.guard'
import { WechatPayDto, WechatPayQuery } from 'src/admin/dtos/pay.dto'
import { WechatRefundPayDto } from 'src/admin/dtos/refund.dto'
import { ApiTradeSerivce } from '../service/api.trade.service'
import {
  WeChatAppletPayService,
  WeChatAppPayService,
  WeChatBaseCloseOrderRes,
  WeChatBaseQueryOrderRes,
  WeChatBaseQueryRefundRes,
  WechatConfig,
  WeChatJSAPIPayService,
  WeChatMicroPayOrderRes,
  WeChatMicroPayService,
  WeChatNativePayService,
  WeChatOtherPayOrderRes,
  WeChatPayBaseService,
  WeChatTradeType,
  WeChatWapPayService
} from 'galaxy-pay-config'
import { TradeChannel } from 'src/common/enum/trade.enum'

@Controller('wechat')
@UseGuards(PayGuard)
export class WechatController {
  constructor(
    private readonly wechatAppletPayService: WeChatAppletPayService,
    private readonly wechatJSAPIPayService: WeChatJSAPIPayService,
    private readonly wechatNativePayService: WeChatNativePayService,
    private readonly wechatWapPayService: WeChatWapPayService,
    private readonly wechatMicroPayService: WeChatMicroPayService,
    private readonly apiTradeService: ApiTradeSerivce,
    private readonly wechatBaseservice: WeChatPayBaseService,
    private readonly wechatAppPayService: WeChatAppPayService
  ) {}

  /**
   * 微信小程序支付
   * @param body WechatPayDto
   * @param wechat_config WechatConfig
   */
  @Post('applet')
  async appletpay(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config)
    const result = await this.wechatAppletPayService.pay(
      {
        trade_type: WeChatTradeType.APP,
        notify_url: wechat_config.notify_url,
        body: body.body,
        out_trade_no: body.sys_trade_no,
        total_fee: body.money,
        spbill_create_ip: ''
      },
      wechat_config
    )
    return result
  }

  /**
   * 微信APP支付
   * @param body WechatPayDto
   * @param wechat_config WechatConfig
   */
  @Post('app')
  async app(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config)
    return await this.wechatAppPayService.pay(
      {
        trade_type: WeChatTradeType.APP,
        notify_url: wechat_config.notify_url,
        body: body.body,
        out_trade_no: body.sys_trade_no,
        total_fee: body.money,
        spbill_create_ip: ''
      },
      wechat_config
    )
  }

  /**
   * 微信退款接口
   * @param body WechatRefundPayDto
   * @param wechat_config WechatConfig
   */
  @Post('refund')
  async refund(@Body() body: WechatRefundPayDto, @PayConfig() wechat_config: WechatConfig): Promise<string> {
    await this.apiTradeService.generateRefundOrder(body, wechat_config, TradeChannel.wechat)
    const refund_result = await this.wechatBaseservice.refund(
      {
        out_refund_no: body.sys_trade_no,
        transaction_id: body.sys_transaction_no,
        total_fee: parseInt(body.money),
        refund_fee: parseInt(body.refund_money),
        refund_desc: body.body,
        notify_url: wechat_config.notify_url
      },
      wechat_config
    )
    if (refund_result.return_code == 'SUCCESS') {
      if (
        await this.apiTradeService.refundSuccess(body.sys_trade_no, TradeChannel.wechat, refund_result.transaction_id)
      ) {
        return '退款成功！'
      }
    } else {
      throw new HttpException(refund_result.err_code_des, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 微信jsapi 支付
   * @param body WechatPayDto
   * @param wechat_config WechatConfig
   */
  @Post('jsapi')
  async jsapi(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig): Promise<WeChatOtherPayOrderRes> {
    await this.apiTradeService.generateOrder(body, wechat_config)
    return await this.wechatJSAPIPayService.pay(
      {
        trade_type: WeChatTradeType.JSAPI,
        notify_url: wechat_config.notify_url,
        body: body.body,
        out_trade_no: body.sys_trade_no,
        total_fee: body.money,
        spbill_create_ip: ''
      },
      wechat_config
    )
  }

  /**
   * 微信扫码支付
   * @param body WechatPayDto
   * @param wechat_config WechatConfig
   */
  @Post('native')
  async native(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig): Promise<WeChatOtherPayOrderRes> {
    await this.apiTradeService.generateOrder(body, wechat_config)
    return await this.wechatNativePayService.pay(
      {
        trade_type: WeChatTradeType.NATIVE,
        notify_url: wechat_config.notify_url,
        body: body.body,
        out_trade_no: body.sys_trade_no,
        total_fee: body.money,
        spbill_create_ip: ''
      },
      wechat_config
    )
  }

  /**
   * 微信h5支付
   * @param body WechatPayDto
   * @param wechat_config WechatConfig
   */
  @Post('h5')
  async h5pay(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig): Promise<WeChatOtherPayOrderRes> {
    await this.apiTradeService.generateOrder(body, wechat_config)
    return await this.wechatWapPayService.pay(
      {
        trade_type: WeChatTradeType.MWEB,
        notify_url: wechat_config.notify_url,
        body: body.body,
        out_trade_no: body.sys_trade_no,
        total_fee: body.money,
        spbill_create_ip: ''
      },
      wechat_config
    )
  }

  /**
   * 付款码支付类
   * @param body WechatPayDto
   * @param wechat_config WechatConfig
   */
  @Post('micro')
  async micro(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig): Promise<WeChatMicroPayOrderRes> {
    await this.apiTradeService.generateOrder(body, wechat_config)
    const request_param = {
      trade_type: WeChatTradeType.MWEB,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.sys_trade_no,
      total_fee: body.money,
      auth_code: '',
      spbill_create_ip: ''
    }
    const result = await this.wechatMicroPayService.pay(request_param, wechat_config)
    return result
  }

  /**
   * 微信交易关闭
   * @param body WechatPayQuery
   * @param wechat_config WechatConfig
   */
  @Post('close')
  async close(
    @Body() body: WechatPayQuery,
    @PayConfig() wechat_config: WechatConfig
  ): Promise<WeChatBaseCloseOrderRes> {
    return await this.wechatBaseservice.closeOrder(
      {
        out_trade_no: body.sys_trade_no
      },
      wechat_config
    )
  }

  /**
   * 微信交易查询
   * @param body WechatPayQuery
   * @param wechat_config WechatConfig
   */
  @Post('query')
  async query(
    @Body() body: WechatPayQuery,
    @PayConfig() wechat_config: WechatConfig
  ): Promise<WeChatBaseQueryOrderRes> {
    return await this.wechatBaseservice.queryOrder(
      {
        out_trade_no: body.sys_trade_no
      },
      wechat_config
    )
  }

  /**
   * 微信退款查询
   * @param body WechatPayQuery
   * @param wechat_config WechatConfig
   */
  @Post('queryRefund')
  async queryRefund(
    @Body() body: WechatPayQuery,
    @PayConfig() wechat_config: WechatConfig
  ): Promise<WeChatBaseQueryRefundRes> {
    return await this.wechatBaseservice.queryRefund(
      {
        out_trade_no: body.sys_trade_no
      },
      wechat_config
    )
  }
}
