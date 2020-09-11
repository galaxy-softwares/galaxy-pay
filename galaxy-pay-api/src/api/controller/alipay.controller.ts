import { Controller, Post, Query, Body, HttpException, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AliPagePayService } from 'src/pay/module/ali/service/page.pay.service';
import { AliAppPayService } from 'src/pay/module/ali/service/app.pay.service';
import { SoftwareService } from 'src/admin/service/software.service';
import { AliTradePayService } from 'src/pay/module/ali/service/trade.pay.service';
import { AlipayConfig, AlipayBaseBizContent } from 'src/pay/module/ali/interfaces/base.interface';
import { AliWapPayService } from 'src/pay/module/ali/service/wap.pay.service';
import { AlipayPrecreateResponse, AlipayTradeRefundResponse, AlipayTradeCreateResponse, AlipayTradeCloseResponse, AlipayTradeQueryResponse, AlipayPrecreateBizContent, AlipayCreateBizContent } from 'src/pay/module/ali/interfaces/trade.interface';
import { AlipayWapBizContent } from 'src/pay/module/ali/interfaces/wap.interface';
import { AlipayRefundBizContent } from 'src/pay/module/ali/interfaces/refund.interface';
import { AliPayDto } from 'src/common/dtos/pay.dto';
import { ApiAlipayService } from './service/api.alipay.service';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { PayGuard } from 'src/common/guard/pay.guard';

@Controller("alipay")
@UseGuards(PayGuard)
export class AlipayController {
    constructor(
        private readonly aliPagePaySerice: AliPagePayService,
        private readonly aliAppPayService: AliAppPayService,
        private readonly alitradePayService: AliTradePayService,
        private readonly aliwapPayService: AliWapPayService,
        private readonly apiAlipayService: ApiAlipayService,
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
    @Post("query")
    async tradePay(@Query() param: AliPayDto, @Body() body): Promise<AlipayTradeQueryResponse> {  
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = await this.alitradePayService.query(body, alipayConfig);
        return result
    }

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
    async refund(@Query() param: AliPayDto, @Body() body: AlipayRefundBizContent): Promise<AlipayTradeRefundResponse> {
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = this.alitradePayService.refund(body, alipayConfig);
        return result
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
    @Post("close")
    async close(@Query() param: AliPayDto, @Body() body): Promise<AlipayTradeCloseResponse> {
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = this.alitradePayService.close(body, alipayConfig);
        return result
    }
}