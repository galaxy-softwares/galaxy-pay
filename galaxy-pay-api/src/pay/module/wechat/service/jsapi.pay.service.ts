import { Injectable } from '@nestjs/common';

import { WeChatOtherPayOrderReqParam, WeChatOtherPayOrderRes } from '../interfaces/order.interface';
import { WeChatPayBaseService } from './base.service';
import { WechatConfig } from '../interfaces/base.interface';
import { WeChatTradeType } from '../enums/trade-type.enum';

/**
 * 微信支付-JSAPI支付类
 */
@Injectable()
export class WeChatJSAPIPayService extends WeChatPayBaseService {
    /**
     * JSAPI支付
     * @param wechatConfig 微信配置
     * @param params JSAPI支付接口请求参数
     */
    async pay(wechatConfig: WechatConfig, params: WeChatOtherPayOrderReqParam): Promise<WeChatOtherPayOrderRes> {
        params.trade_type = WeChatTradeType.JSAPI;
        return await this.requestUtil.post<WeChatOtherPayOrderRes>(this.unifiedOrderUrl, this.processParams(params, wechatConfig));
    }
}