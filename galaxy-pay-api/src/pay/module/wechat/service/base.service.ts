import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { WeChatRequestUtil } from '../utils/request.util';
import { WeChatBaseCloseOrderReqParam, WeChatBaseCloseOrderRes, WeChatBaseQueryOrderReqParam, WeChatBaseQueryOrderRes } from '../interfaces/order.interface';
import * as https from 'https';
import { WeChatBaseQueryRefundRes, WeChatBaseQueryRefundReqParam } from '../interfaces/refund.interface';
import { WeChatPayCertificateAgentProvider } from '../constants/wechat.constant';
import { WeChatSignUtil } from '../utils/sign.util';
import { RandomUtil } from '../utils/random.util';
import { WechatConfig } from '../interfaces/base.interface';

@Injectable()
export class WeChatPayBaseService {
    protected apiBase = 'https://api.mch.weixin.qq.com';
    /** 统一下单接口地址 */
    protected readonly unifiedOrderUrl = `${this.apiBase}/pay/unifiedorder`;
    /** 查询订单接口地址 */
    protected readonly queryOrderUrl = `${this.apiBase}/pay/orderquery`;
    /** 关闭订单接口地址 */
    protected readonly closeOrderUrl = `${this.apiBase}/pay/closeorder`;
    /** 申请退款接口地址 */
    protected readonly refundUrl = `${this.apiBase}/secapi/pay/refund`;
    /** 查询退款接口地址 */
    protected readonly refundQueryUrl = `${this.apiBase}/pay/refundquery`;
    /** 下载对账单接口地址 */
    protected readonly downloadBillUrl = `${this.apiBase}/pay/downloadbill`;
    /** 下载资金账单接口地址 */
    protected readonly downloadFundFlowUrl = `${this.apiBase}/pay/downloadfundflow`;

    constructor(
        @Inject(WeChatRequestUtil) protected readonly requestUtil: WeChatRequestUtil,
        @Inject(WeChatPayCertificateAgentProvider) protected readonly certificateAgent: https.Agent,
        @Inject(WeChatSignUtil) protected readonly signUtil: WeChatSignUtil,
        @Inject(RandomUtil) private readonly randomUtil: RandomUtil
    ) {
    }

        /**
     * 查询订单
     *
     * @param params 查询订单请求参数
     */
    public async queryOrder(params: WeChatBaseQueryOrderReqParam, wechatConfig): Promise<WeChatBaseQueryOrderRes> {
        if (!params.out_trade_no && !params.transaction_id) throw new HttpException('参数有误，out_trade_no 和 transaction_id 二选一', HttpStatus.BAD_REQUEST);

        return await this.requestUtil.post<WeChatBaseQueryOrderRes>(this.queryOrderUrl, this.processParams(params, wechatConfig));
    }

    /**
     * 关闭订单
     *
     * @param params 关闭订单请求参数
     */
    public async closeOrder(params: WeChatBaseCloseOrderReqParam, wechatConfig): Promise<WeChatBaseCloseOrderRes> {
        return await this.requestUtil.post<WeChatBaseCloseOrderRes>(this.closeOrderUrl, this.processParams(params, wechatConfig));
    }

    /**
     * 申请退款
     *
     * @param params 申请退款请求参数
     */
    // public async refund(params: WeChatBaseRefundReqParam): Promise<WeChatBaseRefundRes> {
    //     if (!params.out_trade_no && !params.transaction_id) throw new Error('参数有误，out_trade_no 和 transaction_id 二选一');
    //     return await this.requestUtil.post<WeChatBaseRefundRes>(this.refundUrl, params, { httpsAgent: this.certificateAgent });
    // }

    /**
     * 查询退款
     *
     * @param params 查询退款请求参数
     */
    public async queryRefund(params: WeChatBaseQueryRefundReqParam, wechatConfig): Promise<WeChatBaseQueryRefundRes> {
        if (!params.out_trade_no && !params.transaction_id && !params.out_refund_no && !params.refund_id) {
            throw new HttpException('参数有误，out_trade_no、transaction_id、out_refund_no 和 refund_id 四选一', HttpStatus.BAD_REQUEST);
        }
        return await this.requestUtil.post<WeChatBaseQueryRefundRes>(this.refundQueryUrl, this.processParams(params, wechatConfig));
    }

    /**
     * 
     * @param params 微信支付参数
     * @param config 微信支付配置
     */
    processParams(params, config: WechatConfig) {
        params.notify_url = config.notify_url;
        params.appid = config.app_id;
        params.mch_id = config.mch_id;
        params.nonce_str = this.randomUtil.genRandomStr();
        params.sign_type =  'MD5';
        params.sign = this.signUtil.sign(params, config.mch_key, "MD5");
        return params;
    }
}
