import { Controller, Post, Body, UseGuards, Get, Query, Inject, HttpService } from '@nestjs/common';
import { AliPagePayService } from 'src/pay/module/ali/service/page.pay.service';
import { AliAppPayService } from 'src/pay/module/ali/service/app.pay.service';
import { AliTradePayService } from 'src/pay/module/ali/service/trade.pay.service';
import { AlipayConfig } from 'src/pay/module/ali/interfaces/base.interface';
import { AliWapPayService } from 'src/pay/module/ali/service/wap.pay.service';
import { AlipayPrecreateResponse, AlipayTradeCreateResponse, AlipayTradeRefundResponse } from 'src/pay/module/ali/interfaces/trade.interface';
import { AliPayDto, AliRefundDto } from 'src/common/dtos/pay.dto';
import { ApiAlipayService } from './service/api.alipay.service';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { PayGuard } from 'src/common/guard/pay.guard';
import { RefundService } from 'src/admin/service/refund.service';
import { AliSignUtil } from 'src/pay/module/ali/util/sign.util';
import { OrderChannel } from 'src/common/entities/order.entity';

@Controller("alipay")
@UseGuards(PayGuard)
export class AlipayController {
    constructor(
        private readonly aliPagePaySerice: AliPagePayService,
        private readonly aliAppPayService: AliAppPayService,
        private readonly alitradePayService: AliTradePayService,
        private readonly aliwapPayService: AliWapPayService,
        private readonly apiAlipayService: ApiAlipayService,
        private readonly refundService: RefundService,
        private readonly aliSignUtil: AliSignUtil,
        @Inject(HttpService) protected readonly httpService: HttpService,
    ) {}
    
    /**
     * app支付
     * @param param
     * @param body 
     */
    @Post("app")
    async appPay(@Body() body: AliPayDto, @PayConfig() payConfig: AlipayConfig) {
        await this.apiAlipayService.generateAliOrder(payConfig, body);
        const biz_count = {
            product_code: "QUICK_MSECURITY_PAY",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }
        return this.aliAppPayService.pay(biz_count, payConfig);
    }  

    /**
     * pc 支付
     * @param param 
     * @param body 
     */
    @Post("page")
    async pagePay(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<string> {  
        await this.apiAlipayService.generateAliOrder(payConfig, body);
        const biz_count = {
            product_code: "FAST_INSTANT_TRADE_PAY",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }
        return this.aliPagePaySerice.pay(biz_count, payConfig);
    }

    /**
     * 查询订单
     * @param param 
     * @param body 
     */
    // @Post("query")
    // async tradePay(@Query() param: AliPayDto, @Body() body): Promise<AlipayTradeQueryResponse> {  
    //     const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
    //     const result = await this.alitradePayService.query(body, alipayConfig);
    //     return result
    // }

    /**
     * 支付宝扫码接口
     * @param param 
     * @param body 
     */
    @Post("precreate")
    async precreate(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<AlipayPrecreateResponse> {
        await this.apiAlipayService.generateAliOrder(payConfig, body);
        const biz_count = {
            product_code: "FACE_TO_FACE_PAYMENT",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }
        const result = await this.alitradePayService.precreate(biz_count, payConfig);
        return result
    }

    /**
     * 支付宝手机支付
     * @param param
     * @param body
     */
    @Post("wap")
    async wap(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<string> {
        await this.apiAlipayService.generateAliOrder(payConfig, body);
        const biz_count = {
            product_code: "FACE_TO_FACE_PAYMENT",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }
        const result = await this.aliwapPayService.pay(biz_count, payConfig);
        return result
    }

    /**
     * 支付宝退款接口
     * @param param
     * @param body
     */
    @Post("refund")
    async refund(@Body() body: AliRefundDto,  @PayConfig() payConfig: AlipayConfig): Promise<any> {
        await this.apiAlipayService.generateAliRefund(payConfig, body);
        const biz_count = {
            trade_no: body.trade_no,
            refund_amount: body.refund_money,
            refund_reason: body.refund_reason,
        }
        const refundResult = await this.alitradePayService.refund(biz_count, payConfig);
        if (refundResult.code == '1000') {
          const order = await this.refundService.findOrder(refundResult.trade_no);
          const status = await this.refundService.refundSuccess(order.out_trade_no, OrderChannel.alipay);
          if (status) {
            const result = await this.httpService.post(order.callback_url, JSON.stringify(order)).toPromise();
            console.log(result);
          }
        }
    }

    /**
     * 支付宝订单创建接口
     * @param param
     * @param body
     */
    @Post("create")
    async create(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<AlipayTradeCreateResponse> {
        await this.apiAlipayService.generateAliOrder(payConfig, body);
        const biz_count = {
            product_code: "FACE_TO_FACE_PAYMENT",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }
        const result = await this.alitradePayService.create(biz_count, payConfig);
        return result
    }

    /**
     * 支付宝订单关闭接口
     * @param param 
     * @param body 
     */
    // @Post("close")
    // async close(@Query() param: AliPayDto, @Body() body): Promise<AlipayTradeCloseResponse> {
    //     const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
    //     const result = this.alitradePayService.close(body, alipayConfig);
    //     return result
    // }
}