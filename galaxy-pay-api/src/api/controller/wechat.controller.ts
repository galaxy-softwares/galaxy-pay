import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { WeChatAppletPayService } from 'src/pay/module/wechat/service/applet.pay.service';
import { WeChatJSAPIPayService } from 'src/pay/module/wechat/service/jsapi.pay.service';
import { WeChatNativePayService } from 'src/pay/module/wechat/service/native.pay.service';
import { WeChatWapPayService } from 'src/pay/module/wechat/service/wap.pay.service';
import { WeChatMicroPayService } from 'src/pay/module/wechat/service/micro.pay.service';
import { WeChatAppPayService } from 'src/pay/module/wechat/service/app.pay.service';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { WechatConfig } from 'src/pay/module/wechat/interfaces/base.interface';
import { WeChatTradeType } from 'src/pay/module/wechat/enums/trade-type.enum';
import { PayGuard } from 'src/common/guard/pay.guard';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { ApiTradeSerivce } from './service/api.trade.service';
import { TradeChannel } from 'src/common/enum/trade.enum';
import { WechatPayDto } from 'src/admin/dtos/pay.dto';
import { WechatRefundPayDto } from 'src/admin/dtos/refund.dto';

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
    private readonly wechatAppPayService: WeChatAppPayService,
  ) {}

  /**
   * 微信小程序支付
   * @param param
   * @param body 详情见WeChatAppletPayService接口
   */
  @Post('applet')
  async appletpay(@Body() body: WechatPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    const payBody = {
      trade_type: WeChatTradeType.APP,
      notify_url: payConfig.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatAppletPayService.pay(payConfig, payBody);
    return result;
  }

  /**
   * 微信APP支付
   * @param param
   * @param body 详情见WeChatAppletPayService接口
   */
  @Post('app')
  async app(@Body() body: WechatPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    const payBody = {
      trade_type: WeChatTradeType.APP,
      notify_url: payConfig.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatAppPayService.pay(payConfig, payBody);
    return result;
  }

  /**
   * 微信退款接口
   * @param body
   * @param payConfig
   */
  @Post('refund')
  async refund(@Body() body: WechatRefundPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateRefundOrder(body, payConfig);
    const payBody = {
      transaction_id: body.trade_no,
      out_refund_no: body.out_trade_no,
      total_fee: parseInt(body.money),
      refund_fee: parseInt(body.refund_money),
      refund_desc: body.body,
      notify_url: payConfig.notify_url,
    };
    const httpConfig = new https.Agent({
      pfx: fs.readFileSync(path.join(__dirname, payConfig.apiclient_cert)),
      passphrase: payConfig.mch_id,
    });
    const refund_result = await this.wechatAppPayService.refund(payBody, payConfig, httpConfig);
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
  async jsapi(@Body() body: WechatPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    const payBody = {
      trade_type: WeChatTradeType.JSAPI,
      notify_url: payConfig.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatJSAPIPayService.pay(payConfig, payBody);
    return result;
  }

  /**
   * 微信扫码支付
   * @param param
   * @param body
   */
  @Post('native')
  async native(@Body() body: WechatPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    const payBody = {
      trade_type: WeChatTradeType.NATIVE,
      notify_url: payConfig.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatNativePayService.pay(payConfig, payBody);
    return result;
  }

  /**
   * 微信h5支付
   * @param param
   * @param body
   */
  @Post('h5')
  async h5pay(@Body() body: WechatPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    const payBody = {
      trade_type: WeChatTradeType.MWEB,
      notify_url: payConfig.notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      spbill_create_ip: '',
    };
    const result = await this.wechatNativePayService.pay(payConfig, payBody);
    return result;
  }

  /**
   * 付款码支付类
   * @param param
   * @param data
   */
  @Post('micro')
  async micro(@Body() body: WechatPayDto, @PayConfig() payConfig: WechatConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    const payBody = {
      trade_type: WeChatTradeType.MWEB,
      notify_url: payConfig.refund_notify_url,
      body: body.body,
      out_trade_no: body.out_trade_no,
      total_fee: body.money,
      auth_code: '',
      spbill_create_ip: '',
    };
    const result = await this.wechatMicroPayService.pay(payConfig, payBody);
    return result;
  }
}
