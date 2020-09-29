import { Controller, Post, Body, UseGuards, Inject, HttpService } from '@nestjs/common';
import { AliPagePayService } from 'src/pay/module/ali/service/page.pay.service';
import { AliAppPayService } from 'src/pay/module/ali/service/app.pay.service';
import { AliTradePayService } from 'src/pay/module/ali/service/trade.pay.service';
import { AlipayConfig } from 'src/pay/module/ali/interfaces/base.interface';
import { AliWapPayService } from 'src/pay/module/ali/service/wap.pay.service';
import { AlipayPrecreateBizContent, AlipayPrecreateResponse, AlipayTradeCreateResponse } from 'src/pay/module/ali/interfaces/trade.interface';
import { AliPayDto, AliPayRefundDto } from 'src/common/dtos/pay.dto';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { PayGuard } from 'src/common/guard/pay.guard';
import { RefundService } from 'src/admin/service/refund.service';
import { OrderChannel } from 'src/common/entities/order.entity';
import { TransformService } from './service/transform.service';
import { AlipayAppBizContent } from 'src/pay/module/ali/interfaces/app.interface';
import { ApiOrderSerivce } from './service/api.order.service';
import { AlipayPageBizContent } from 'src/pay/module/ali/interfaces/page.interface';
import { AlipayWapBizContent } from 'src/pay/module/ali/interfaces/wap.interface';
import { AlipayRefundBizContent } from 'src/pay/module/ali/interfaces/refund.interface';

@Controller("alipay")
@UseGuards(PayGuard)
export class AlipayController {
    constructor(
        private readonly aliPagePaySerice: AliPagePayService,
        private readonly aliAppPayService: AliAppPayService,
        private readonly alitradePayService: AliTradePayService,
        private readonly aliwapPayService: AliWapPayService,
        private readonly apiOrderService: ApiOrderSerivce,
        private readonly refundService: RefundService,
        private readonly transformService: TransformService,
        @Inject(HttpService) protected readonly httpService: HttpService,
    ) {}
    
    /**
     * app支付
     * @param param
     * @param body 
     */
    @Post("app")
    async appPay(@Body() body: AliPayDto, @PayConfig() payConfig: AlipayConfig) {
        await this.apiOrderService.generateOrder(body, payConfig);
        const biz_count = this.transformService.transformAlipayParams<AlipayAppBizContent>({
            product_code: "QUICK_MSECURITY_PAY",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }, payConfig, "alipay.trade.app.pay");
        return this.aliAppPayService.pay(biz_count, payConfig);
    }  

    /**
     * pc 支付
     * @param body AliPayDto
     * @param payConfig AlipayConfig
     */
    @Post("page")
    async pagePay(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<string> {  
        await this.apiOrderService.generateOrder(body, payConfig);
        const param = this.transformService.transformAlipayParams<AlipayPageBizContent>({
            product_code: "FAST_INSTANT_TRADE_PAY",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }, payConfig, "alipay.trade.page.pay");
        return this.aliPagePaySerice.pay(param, payConfig.private_key);
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
     * @param body AliPayDto
     * @param payConfig AlipayConfig
     */
    @Post("precreate")
    async precreate(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<AlipayPrecreateResponse> {
        await this.apiOrderService.generateOrder(body, payConfig);
        const param = this.transformService.transformAlipayParams<AlipayPrecreateBizContent>({
            product_code: "FACE_TO_FACE_PAYMENT",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }, payConfig, "alipay.trade.precreate");
        return await this.alitradePayService.precreate(param, payConfig.private_key, payConfig.public_key)
    }

    /**
     * 支付宝手机支付
     * @param body AliPayDto
     * @param payConfig AlipayConfig
     */
    @Post("wap")
    async wap(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<string> {
        await this.apiOrderService.generateOrder(body, payConfig);
        const param = this.transformService.transformAlipayParams<AlipayWapBizContent>({
            product_code: "FACE_TO_FACE_PAYMENT",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }, payConfig, 'alipay.trade.wap.pay');
        return this.aliwapPayService.pay(param, payConfig.private_key)
    }

    /**
     * 支付宝退款接口
     * @param param
     * @param body
     */
    @Post("refund")
    async refund(@Body() body: AliPayRefundDto,  @PayConfig() payConfig: AlipayConfig): Promise<any> {
        await this.apiOrderService.generateRefundOrder(body, payConfig);
        const param = this.transformService.transformAlipayParams<AlipayRefundBizContent>({
            trade_no: body.trade_no,
            refund_amount: body.refund_money,
            refund_reason: body.refund_reason,
        }, payConfig, 'alipay.trade.refund');
        const refundResult = await this.alitradePayService.refund(param, payConfig.private_key, payConfig.public_key);
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
        await this.apiOrderService.generateOrder(body, payConfig);
        const param = this.transformService.transformAlipayParams<AlipayWapBizContent>({
            product_code: "FACE_TO_FACE_PAYMENT",
            subject: body.body,
            out_trade_no: body.out_trade_no,
            total_amount: body.money,
            ...body.biz_count
        }, payConfig, 'alipay.trade.create');
        return await this.alitradePayService.create(param, payConfig.private_key, payConfig.public_key);
    }

    /**
     * 支付宝订单关闭接口
     * @param param 
     * @param body 
     */
    // @Post("close")
    // async close(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<AlipayTradeCloseResponse> {
    //     const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
    //     const result = this.alitradePayService.close(body, alipayConfig);
    //     return result
    // }
}