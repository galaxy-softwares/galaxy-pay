import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { PayGuard } from 'src/common/guard/pay.guard';
import { WechatPayDto } from 'src/admin/dtos/pay.dto';
import { WechatRefundPayDto } from 'src/admin/dtos/refund.dto';
import { ApiTradeSerivce } from '../service/api.trade.service';
import {
  WeChatAppletPayService,
  WeChatAppPayService,
  WechatConfig,
  WeChatJSAPIPayService,
  WeChatMicroPayService,
  WeChatNativePayService,
  WeChatPayBaseService,
  WeChatTradeType,
  WeChatWapPayService,
} from 'galaxy-pay-config';
import { TradeChannel } from 'src/common/enum/trade.enum';

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
    private readonly baseservice: WeChatPayBaseService,
    private readonly wechatAppPayService: WeChatAppPayService,
  ) {}

  /**
   * 微信小程序支付
   * @param param
   * @param body 详情见WeChatAppletPayService接口
   */
  @Post('applet')
  async appletpay(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config);
    const requst_params = {
      trade_type: WeChatTradeType.APP,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatAppletPayService.pay(requst_params, wechat_config);
    return result;
  }

  /**
   * 微信APP支付
   * @param param
   * @param body 详情见WeChatAppletPayService接口
   */
  @Post('app')
  async app(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config);
    const requst_params = {
      trade_type: WeChatTradeType.APP,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatAppPayService.pay(requst_params, wechat_config);
    return result;
  }

  /**
   * 微信退款接口
   * @param body
   * @param wechat_config
   */
  @Post('refund')
  async refund(@Body() body: WechatRefundPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateRefundOrder(body, wechat_config);
    const requst_params = {
      transaction_id: body.trade_no,
      out_refund_no: body.out_trade_no,
      total_fee: parseInt(body.money),
      refund_fee: parseInt(body.refund_money),
      refund_desc: body.body,
      notify_url: wechat_config.notify_url,
    };

    const refund_result = await this.baseservice.refund(requst_params, wechat_config);
    if (refund_result.return_code == 'SUCCESS') {
      if (
        await this.apiTradeService.refundSuccess(
          refund_result.out_trade_no,
          refund_result.out_refund_no,
          TradeChannel.wechat,
        )
      ) {
        return '退款成功';
      } else {
        return '退款失败';
      }
    } else {
      throw new HttpException(refund_result.err_code_des, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 微信jsapi 支付
   * @param param
   * @param body
   */
  @Post('jsapi')
  async jsapi(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config);
    const requst_params = {
      trade_type: WeChatTradeType.JSAPI,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatJSAPIPayService.pay(requst_params, wechat_config);
    return result;
  }

  /**
   * 微信扫码支付
   * @param param
   * @param body
   */
  @Post('native')
  async native(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config);
    const requst_params = {
      trade_type: WeChatTradeType.NATIVE,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatNativePayService.pay(requst_params, wechat_config);
    return result;
  }

  /**
   * 微信h5支付
   * @param param
   * @param body
   */
  @Post('h5')
  async h5pay(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config);
    const requst_params = {
      trade_type: WeChatTradeType.MWEB,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatNativePayService.pay(requst_params, wechat_config);
    return result;
  }

  /**
   * 付款码支付类
   * @param param
   * @param data
   */
  @Post('micro')
  async micro(@Body() body: WechatPayDto, @PayConfig() wechat_config: WechatConfig) {
    await this.apiTradeService.generateOrder(body, wechat_config);
    const requst_params = {
      trade_type: WeChatTradeType.MWEB,
      notify_url: wechat_config.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      auth_code: '',
      spbill_create_ip: '',
    };
    const result = await this.wechatMicroPayService.pay(requst_params, wechat_config);
    return result;
  }
}
