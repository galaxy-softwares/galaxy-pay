import { Controller, Get, Post,  Request, Res, Inject, Req, HttpService } from '@nestjs/common';
import { SoftwareService } from './admin/service/software.service';
import { AliSignUtil } from './pay/module/ali/util/sign.util';
import { TradeService } from './admin/service/trade.service';
import { WeChatSignUtil } from './pay/module/wechat/utils/sign.util';
import { WeChatNotifyParserUtil } from './pay/module/wechat/utils/notify-parser.util';
import { WeChatPayNotifyRes } from './pay/module/wechat/interfaces/notify.interface';
import { TradeChannel } from './common/enum/trade.enum';

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
    const data  = req.body;
    const order = await this.tradeService.findOrder(data.out_trade_no)
    const alipayConfig = await this.softwareService.findSoftwarePayConfig(order.appid)
    delete data.pay_type;
    const signResult = this.aliSignUtil.responSignVerify(data, alipayConfig.public_key);
    if (signResult) {
      const status = await this.tradeService.paySuccess(data.out_trade_no, TradeChannel.alipay, data.trade_no);
      if (status) {
        // 从order中拿到callback_url 然后发送过去~
        // const callbackResut = await this.httpService.post(order.callback_url, JSON.stringify(order)).toPromise();
      }
    }
  }

  @Post("wechat_refund_notify_url")
  async refund_notify_url(@Req() req, @Res() res) {
    // res.set('Content-Type', 'text/html');
    // res.status(200);
    // try {
    //   const data = await this.weChatNotifyParserUtil.receiveReqData<WeChatRefundNotifyRes>(req, 'pay');
    //   const payConfig = await this.softwareService.findSoftwareByWxAppid(data.appid);
    //   const result = await this.weChatNotifyParserUtil.parseRefundNotify(data, payConfig.mch_key);
    //   if (result) {
    //     const refundOrder = await this.refundSerivce.findOrder(data.out_refund_no);
    //     if(refundOrder.order_status == OrderStatus.UnPaid) {
    //       const status = await this.tradeService.paySuccess(data.out_trade_no, OrderChannel.wechat, data.transaction_id);
    //       if (!status) {
    //         res.end(this.weChatNotifyParserUtil.generateFailMessage("订单状态修改失败！"))
    //       }
    //       const callbackResut = await this.httpService.post(refundOrder.callback_url, JSON.stringify(refundOrder)).toPromise();
    //       console.log(callbackResut);
    //     } else {
    //       res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
    //     }
    //   }
    // } catch (e) {
    //   res.end(this.weChatNotifyParserUtil.generateFailMessage(e.toString()))
    // }
  }

  @Post("wechat_notify_url")
  async wechat_notify_url(@Req() req, @Res() res) {
    res.set('Content-Type', 'text/html');
    res.status(200);
    const data = await this.weChatNotifyParserUtil.receiveReqData<WeChatPayNotifyRes>(req, 'pay');
    try {
      const order = await this.tradeService.findOrder(data.out_trade_no)
      if (!order) {
        res.end(this.weChatNotifyParserUtil.generateFailMessage("没有查询到订单！"))
      } else if(order.trade_status == '1') {
        res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
      }
      const wechatConfig = await this.softwareService.findSoftwarePayConfig(order.appid)
      // 先拿到微信得签名
      const dataSign = data.sign;
      // 不进行签名验证
      delete data.sign;
      const sign = this.signUtil.sign(data, wechatConfig.mch_key)
      //  还要判断是支付类型！！！！！！！
      if ((sign !== dataSign)|| (data.return_code !== 'SUCCESS')|| (data.result_code !== 'SUCCESS')) {
        res.end(this.weChatNotifyParserUtil.generateFailMessage("签名验证失败"))
      }
      const status = await this.tradeService.paySuccess(data.out_trade_no, TradeChannel.wechat, data.transaction_id);
      if (!status) {
        res.end(this.weChatNotifyParserUtil.generateFailMessage("订单状态修改失败！"))
      }
      const callbackResut = await this.httpService.post(order.callback_url, JSON.stringify(order)).toPromise();
      res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
    } catch(e) {
      res.end(this.weChatNotifyParserUtil.generateFailMessage(e.toString()))
    }
  }

}
