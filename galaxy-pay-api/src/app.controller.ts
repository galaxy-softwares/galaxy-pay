import { Controller, Get, Post, Request, Res, Inject, Req } from '@nestjs/common';
import { SoftwareService } from './admin/service/software.service';
import { AliSignUtil } from './pay/module/ali/util/sign.util';
import { OrderService } from './admin/service/order.service';
import { WeChatSignUtil } from './pay/module/wechat/utils/sign.util';
import { OrderChanle } from './common/entities/order.entity';
import { AlipayConfig } from './pay/module/ali/interfaces/base.interface';

@Controller()
export class AppController {
  constructor(
    private readonly softwareService: SoftwareService,
    private readonly aliSignUtil: AliSignUtil,
    private readonly orderService: OrderService,
    @Inject(WeChatSignUtil) protected readonly signUtil: WeChatSignUtil,
    ) {}

  @Get()
  async getHello() {
    return '我那个晓得！';
  }
  
  @Post("alipay_notify_url")
  async return(@Request() req) {
    try {
      const data  = req.body;
      const order = await this.orderService.findOrder(data.out_trade_no, OrderChanle.alipay)
      const software = await this.softwareService.findSoftwarePay(order.appid)
      const alipayConfig: AlipayConfig = JSON.parse(software.alipay);
      const signResult = this.aliSignUtil.responSignVerify(data, alipayConfig.public_key);
      if (signResult) {
        const status = await this.orderService.paySuccess(data.out_trade_no, OrderChanle.alipay);
        if (status) {
          console.log('订单状态修改成功！')
          // 从order中拿到callback_url 然后发送过去~
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
      const order = await this.orderService.findOrder(data.out_trade_no, OrderChanle.wechat)
      if (!order) {
        res.end(this.returCode(false, '订单不存在'));
      } else if(order.order_status == '1') {
        res.end(this.returCode(true, 'OK'))
      }
      const software = await this.softwareService.findSoftwarePay(order.appid)
      const wechatConfig = JSON.parse(software.wechat);
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
      const status = await this.orderService.paySuccess(data.out_trade_no, OrderChanle.wechat);
      if (!status) {
        res.end(this.returCode(false, '订单状态修改失败！'));
      }
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
