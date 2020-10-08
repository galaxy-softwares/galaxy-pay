import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AliPayBaseService } from "./base.service";
import { AlipayRequestParam } from "../interfaces/base.interface";
import { AlipayTradeRefundResponseData, AlipayPrecreateResponse, AlipayTradeCreateResponse, AlipayTradeCreateResponseData, AlipayTradeCloseResponse, AlipayTradeCloseResponseData, AlipayPrecreateResponseData, AlipayCreateBizContent, AlipayPrecreateBizContent } from "../interfaces/trade.interface";

@Injectable()
export class AliTradePayService extends AliPayBaseService {
    /**
     * 支付宝查询接口
     * @param config AlipayConfig
     * @param body
     * 
     * 
     */
    // async query(body, config: AlipayConfig): Promise<AlipayTradeQueryResponse> {
    //     const data = {
    //         app_id: config.appid,
    //         method: "alipay.trade.query",
    //         notify_url: config.notify_url,
    //         biz_content: JSON.stringify({
    //             ...body
    //         }),
    //     }
    //     this.param = {...this.param, ...data};
    //     try {
    //         const { alipay_trade_query_response } = await this.requestUtil.post<AlipayTradeQueryResponseData>(this.processParams(this.param, config.private_key), config.public_key);
    //         return alipay_trade_query_response;
    //     } catch (e) {
    //         throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    //     }
    // }

    /**
     * 支付宝退款接口
     * @param config AlipayConfig
     * @param body AlipayRefundBizContent
     */
    async refund(param: AlipayRequestParam, private_key: string, public_key: string): Promise<any> {
        try {
            const url = this.processParams(param, private_key);
            const { alipay_trade_refund_response } = await this.requestUtil.post<AlipayTradeRefundResponseData>(url, public_key);
            return alipay_trade_refund_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付宝订单创建
     * @param param AlipayRequestParam
     * @param private_key string
     * @param public_key string
     */
    async create(param: AlipayRequestParam, private_key: string, public_key: string): Promise<AlipayTradeCreateResponse> {
        try {
            const url = this.processParams(param, private_key);
            const  { alipay_trade_create_response } = await this.requestUtil.post<AlipayTradeCreateResponseData>(url, public_key);
            return alipay_trade_create_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付宝关闭订单接口
     * @param config AlipayConfig
     * @param body 
     */
    // async close(body, config: AlipayConfig): Promise<AlipayTradeCloseResponse> {
    //     const param = {
    //         app_id: config.appid,
    //         method: "alipay.trade.create",
    //         notify_url: config.notify_url,
    //         biz_content: JSON.stringify({
    //             ...body,
    //         }),
    //     }
    //     this.param = {...this.param, ...param}
    //     try {
    //         const { alipay_trade_close_response } = await this.requestUtil.post<AlipayTradeCloseResponseData>(this.processParams(this.param, config.private_key), config.public_key);
    //         return alipay_trade_close_response;
    //     } catch (e) {
    //         throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    //     }
    // }

     /**
     * 支付宝扫码接口
     * @param config AlipayConfig
     * @param body AlipayPageBizContent
     */
    async precreate(body: AlipayRequestParam, private_key: string, public_key: string): Promise<AlipayPrecreateResponse> {
        try {
            const url = this.processParams(body, private_key);
            const { alipay_trade_precreate_response } = await this.requestUtil.post<AlipayPrecreateResponseData>(url, public_key);
            return alipay_trade_precreate_response;
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}