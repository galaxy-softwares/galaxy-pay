import { Controller, Get, Post, Request, Res, Inject, Req, HttpService, UseGuards } from '@nestjs/common';
import { SoftwareService } from './admin/service/software.service';
import { AliSignUtil } from './pay/module/ali/util/sign.util';
import { OrderService } from './admin/service/order.service';
import { WeChatSignUtil } from './pay/module/wechat/utils/sign.util';
import { OrderChannel } from './common/entities/order.entity';
import { AlipayConfig } from './pay/module/ali/interfaces/base.interface';
import { PayGuard } from './common/guard/pay.guard';
import { PayConfig } from './common/decorator/pay.config.decorator';

@Controller()
@UseGuards(PayGuard)
export class AppController {
  constructor(
    private readonly softwareService: SoftwareService,
    private readonly aliSignUtil: AliSignUtil,
    private readonly orderService: OrderService,
    @Inject(WeChatSignUtil) protected readonly signUtil: WeChatSignUtil,
    @Inject(HttpService) protected readonly httpService: HttpService,
    ) {}

  @Get()
  async getHello() {
    return '我那个晓得！';
  }

  @Post("alipay_notify_url")
  async return(@Request() req) {
    try {
      const data  = req.body;
      const order = await this.orderService.findOrder(data.out_trade_no)
      const alipayConfig = await this.softwareService.findSoftwarePay(order.appid)
      const signResult = this.aliSignUtil.responSignVerify(data, alipayConfig.public_key);
      if (signResult) {
        const status = await this.orderService.paySuccess(data.out_trade_no, OrderChannel.alipay);
        if (status) {
          // 从order中拿到callback_url 然后发送过去~
          const result = await this.httpService.post(order.callback_url, JSON.stringify(order)).toPromise();
          console.log(result);
        }
      }
    } catch(e) {
      console.log(e.toString());
    }
  }

  @Post("wechat_notify_url")
  async notify(@Req() req, @Res() res) {
    res.set('Content-Type', 'text/html');
    res.status(200);
    const { xml } = req.body;
    const data: any = {};
    for(const item in xml) {
      data[item] = xml[item][0];
    }
    try {
      const order = await this.orderService.findOrder(data.out_trade_no)
      if (!order) {
        res.end(this.returCode(false, '订单不存在'));
      } else if(order.order_status == '1') {
        res.end(this.returCode(true, 'OK'))
      }
      const wechatConfig = await this.softwareService.findSoftwarePay(order.appid)
      // 先拿到微信得签名
      const dataSign = data.sign;
      // 不进行签名验证
      delete data.sign;
      const sign = this.signUtil.sign(data, wechatConfig.mch_key)
      //  还要判断是支付类型！！！！！！！
      if (
        (sign !== dataSign)
        || (data.return_code !== 'SUCCESS')
        || (data.result_code !== 'SUCCESS')
      ) {
        res.end(this.returCode(false, '签名验证失败'));
      }
      const status = await this.orderService.paySuccess(data.out_trade_no, OrderChannel.wechat);
      if (!status) {
        res.end(this.returCode(false, '订单状态修改失败！'));
      }
      this.httpService.post(order.callback_url, order)
      res.end(this.returCode(true, 'OK'));
    } catch(e) {
      res.end(this.returCode(false, e.toString()));
    }
  }

  /**
   * 返回给微信服务器
   * @param boolean $returnCode
   * @param string $msg
   */
  private returCode(returnCode = true, message: string = null) {
    const code = returnCode ? 'SUCCESS': 'FAIL';
    const msg = message ? `${message}` : 'OK';
    return `<xml><return_code><![CDATA[${code}]]></return_code><return_msg><![CDATA[${msg}]]></return_msg></xml>`;
  }
}
