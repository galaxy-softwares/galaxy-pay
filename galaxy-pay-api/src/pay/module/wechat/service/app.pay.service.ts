import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import {
    WeChatAppPayOrderReqParam,
    WeChatAppPayOrderRes,
    WeChatBaseCloseOrderReqParam,
    WeChatBaseCloseOrderRes,
    WeChatBaseQueryOrderReqParam,
    WeChatBaseQueryOrderRes
} from '../interfaces/order.interface';
import { WeChatBaseQueryRefundReqParam, WeChatBaseQueryRefundRes } from '../interfaces/refund.interface';
import { WeChatPayBaseService } from './base.service';
import { WeChatTradeType } from '../enums/trade-type.enum';
import { WechatConfig } from '../interfaces/base.interface';

/**
 * 微信支付-APP支付类
 */
@Injectable()
export class WeChatAppPayService extends WeChatPayBaseService {
    /**
     * APP支付
     *
     * @param params APP支付请求参数
     */
    async pay(wechatConfig: WechatConfig, params: WeChatAppPayOrderReqParam): Promise<any> {
        params.trade_type = WeChatTradeType.APP;

        const result =  await this.requestUtil.post<WeChatAppPayOrderRes>(this.unifiedOrderUrl, this.processParams(params, wechatConfig));
        if (result.return_code !== 'SUCCESS') {
            throw new HttpException(result.return_msg, HttpStatus.BAD_REQUEST);
        }
        // 请求微信服务器之后，返回的参数还需要再做一次加密
        const data = {
            appid: result.appid,
            partnerid: result.mch_id,
            prepayid: result.prepay_id,
            package: "Sign=WXPay",
            noncestr: result.nonce_str,
            timestamp: Date.parse(new Date().toString()) / 1000,
        }
        return {...data, ...{ sign: this.signUtil.sign(data, wechatConfig.mch_key) }}
    }

    /**
     * APP查询订单
     *
     * @param params APP查询订单请求参数
     */
    async queryOrder(params: WeChatBaseQueryOrderReqParam, wechatConfig: WechatConfig): Promise<WeChatBaseQueryOrderRes> {
        (params as any).sign_type = 'no_sign_type';
        return await super.queryOrder(params, wechatConfig);
    }

    /**
     * APP关闭订单
     *
     * @param params APP关闭订单请求参数
     */
    async closeOrder(params: WeChatBaseCloseOrderReqParam, wechatConfig: WechatConfig): Promise<WeChatBaseCloseOrderRes> {
        (params as any).sign_type = 'no_sign_type';
        return await super.closeOrder(params, wechatConfig);
    }

    /**
     * APP查询退款
     *
     * @param params APP查询退款请求参数
     */
    async queryRefund(params: WeChatBaseQueryRefundReqParam, wechatConfig: WechatConfig): Promise<WeChatBaseQueryRefundRes> {
        (params as any).sign_type = 'no_sign_type';
        return await super.queryRefund(params, wechatConfig);
    }
}