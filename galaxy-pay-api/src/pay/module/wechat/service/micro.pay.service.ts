import { Injectable } from '@nestjs/common';

import { WeChatMicroPayOrderReqParam, WeChatMicroPayOrderRes } from '../interfaces/order.interface';
import { WeChatPayBaseService } from './base.service';
import { WechatConfig } from '../interfaces/base.interface';

/**
 * 微信支付-付款码支付类
 */
@Injectable()
export class WeChatMicroPayService extends WeChatPayBaseService {
  /**
   * 付款码支付
   * @param wechatConfig
   * @param params
   */
  async pay(wechatConfig: WechatConfig, params: WeChatMicroPayOrderReqParam) {
    const url = `${this.apiBase}/pay/micropay`;
    return await this.requestUtil.post<WeChatMicroPayOrderRes>(
      url,
      this.processParams(params, wechatConfig),
    );
  }

  /**
   * 撤销订单
   *
   * @param params 撤销订单接口请求参数
   */
  // async closeOrder(params: WeChatMicroPayReverseOrderReqParam): Promise<WeChatMicroPayReverseOrderRes> {
  //     const url = `${this.apiBase}/pay/reverse`;
  //     return await this.requestUtil.post<WeChatMicroPayReverseOrderRes>(url, params, { httpsAgent: this.certificateAgent });
  // }
}
