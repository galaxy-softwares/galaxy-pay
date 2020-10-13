import { Controller, Get, Post,  Request, Res, Inject, Req, HttpService } from '@nestjs/common';
import { AliSignUtil } from './pay/module/ali/util/sign.util';
import { TradeService, SoftwareService } from './admin/service';
import { WeChatSignUtil } from './pay/module/wechat/utils/sign.util';
import { WeChatNotifyParserUtil } from './pay/module/wechat/utils/notify-parser.util';
import { WeChatPayNotifyRes } from './pay/module/wechat/interfaces/notify.interface';
import { TradeChannel } from './common/enum/trade.enum';
import { makeSignStr } from './common/utils/indedx';

@Controller()
export class AppController {
  constructor(
    private readonly softwareService: SoftwareService,
    private readonly aliSignUtil: AliSignUtil,
    private readonly tradeService: TradeService,
    @Inject(WeChatSignUtil) protected readonly signUtil: WeChatSignUtil,
    @Inject(HttpService) protected readonly httpService: HttpService,
    @Inject(WeChatNotifyParserUtil) private readonly weChatNotifyParserUtil: WeChatNotifyParserUtil
    ) {}

  @Get()
  async getHello() {
    return '我那个晓得！';
  }

  @Post("alipay_notify_url")
  async alipay_notify_url(@Request() req) {
    const data = req.body;
    const trade = await this.tradeService.findOrder(data.out_trade_no)
    const { alipayConfig, secret_key} = await this.softwareService.findSoftwarePayConfig(trade.appid)
    delete data.pay_type;
    const sign_result = this.aliSignUtil.responSignVerify(data, alipayConfig.public_key);
    if (sign_result) {
      const status = await this.tradeService.paySuccess(data.out_trade_no, TradeChannel.alipay, data.trade_no);
      if (status) {
        const callback_result = await this.callbackRequest(trade.callback_url, data, secret_key);
        console.log(callback_result, '支付callback 回调状态！');
      }
    }
  }

  @Post("wechat_notify_url")
  async wechat_notify_url(@Req() req, @Res() res) {
    res.set('Content-Type', 'text/html');
    res.status(200);
    try {
      const data = await this.weChatNotifyParserUtil.receiveReqData<WeChatPayNotifyRes>(req, 'pay');
      const order = await this.tradeService.findOrder(data.out_trade_no)
      // 因为已经在支付查询的时候已经做了错误抛出所以不用再去判断是否存在账单。
      if(order.trade_status == '1') {
        res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
      }
      const { wechatConfig, secret_key } = await this.softwareService.findSoftwarePayConfig(order.appid)
      // 先拿到微信得签名
      const data_sign = data.sign;
      // 不进行签名验证
      delete data.sign;
      const sign = this.signUtil.sign(data, wechatConfig.mch_key)
      //  还要判断是支付类型！！！！！！！
      if ((sign !== data_sign)|| (data.return_code !== 'SUCCESS')|| (data.result_code !== 'SUCCESS')) {
        res.end(this.weChatNotifyParserUtil.generateFailMessage("签名验证失败"))
      }
      const status = await this.tradeService.paySuccess(data.out_trade_no, TradeChannel.wechat, data.transaction_id);
      if (status) {
        const callback_result = await this.callbackRequest(order.callback_url, {
          out_trade_no: data.out_trade_no,
          trade_no: data.transaction_id
        }, secret_key);
        console.log(callback_result, '微信支付callback回调状态');
        res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
      }
    } catch(e) {
      res.end(this.weChatNotifyParserUtil.generateFailMessage(e.toString()))
    }
  }

  /**
   * 发送回调通知
   * @param callback_url 
   * @param data 
   * @param app_secret 
   */
  private async callbackRequest(callback_url: string, data: {
    out_trade_no: string,
    trade_no: string,
  }, app_secret: string) {
    const callback_param = {
      out_trade_no: data.out_trade_no,
      trade_no: data.trade_no,
      sign: makeSignStr({
        out_trade_no: data.out_trade_no,
        trade_no: data.trade_no,
      }, app_secret)
    }
    const callback_result = await this.httpService.request({
      url: callback_url,
      params: callback_param,
      method: 'get',
    }).toPromise();
    return callback_result;
  }

}
