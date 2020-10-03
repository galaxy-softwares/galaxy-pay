import { Controller, Post, Body, UseGuards, Inject, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { AliPagePayService } from 'src/pay/module/ali/service/page.pay.service';
import { AliAppPayService } from 'src/pay/module/ali/service/app.pay.service';
import { AliTradePayService } from 'src/pay/module/ali/service/trade.pay.service';
import { AlipayConfig } from 'src/pay/module/ali/interfaces/base.interface';
import { AliWapPayService } from 'src/pay/module/ali/service/wap.pay.service';
import { AlipayPrecreateBizContent, AlipayPrecreateResponse, AlipayTradeCreateResponse } from 'src/pay/module/ali/interfaces/trade.interface';
import { AliPayDto, AliPayRefundDto } from 'src/common/dtos/pay.dto';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { PayGuard } from 'src/common/guard/pay.guard';
import { TransformService } from './service/transform.service';
import { AlipayAppBizContent } from 'src/pay/module/ali/interfaces/app.interface';
import { ApiTradeSerivce } from './service/api.trade.service';
import { AlipayPageBizContent } from 'src/pay/module/ali/interfaces/page.interface';
import { AlipayWapBizContent } from 'src/pay/module/ali/interfaces/wap.interface';
import { AlipayRefundBizContent } from 'src/pay/module/ali/interfaces/refund.interface';
import { TradeChannel } from 'src/common/enum/trade.enum';

@Controller("alipay")
@UseGuards(PayGuard)
export class AlipayController {
    constructor(
        private readonly aliPagePaySerice: AliPagePayService,
        private readonly aliAppPayService: AliAppPayService,
        private readonly alitradePayService: AliTradePayService,
        private readonly aliwapPayService: AliWapPayService,
        private readonly apiTradeService: ApiTradeSerivce,
        private readonly transformService: TransformService,
        @Inject(HttpService) protected readonly httpService: HttpService,
    ) {
    }
    
    /**
     * app支付
     * @param param
     * @param body 
     */
    @Post("app")
    async appPay(@Body() body: AliPayDto, @PayConfig() payConfig: AlipayConfig) {
        await this.apiTradeService.generateOrder(body, payConfig);
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
        
        await this.apiTradeService.generateOrder(body, payConfig);
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
        await this.apiTradeService.generateOrder(body, payConfig);
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
        await this.apiTradeService.generateOrder(body, payConfig);
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
        await this.apiTradeService.generateRefundOrder(body, payConfig);
        const param = this.transformService.transformAlipayParams<AlipayRefundBizContent>({
            trade_no: body.trade_no,
            refund_amount: body.money,
            refund_reason: body.body,
        }, payConfig, 'alipay.trade.refund');
        const refundResult = await this.alitradePayService.refund(param, payConfig.private_key, payConfig.public_key);
        if (refundResult.code == '10000') {
            if(await this.apiTradeService.refundSuccess(body.out_trade_no, body.trade_no, TradeChannel.alipay)) {
                return "退款成功！";
            }
        } else {
            throw new HttpException("订单退款失败！请稍后重试！", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 支付宝订单创建接口
     * @param param
     * @param body
     */
    @Post("create")
    async create(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<AlipayTradeCreateResponse> {
        await this.apiTradeService.generateOrder(body, payConfig);
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