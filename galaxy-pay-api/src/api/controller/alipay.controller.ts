import { Controller, Post, Query, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AliPagePayService } from 'src/pay/module/ali/service/page.pay.service';
import { AliAppPayService } from 'src/pay/module/ali/service/app.pay.service';
import { SoftwareService } from 'src/admin/service/software.service';
import { AliTradePayService } from 'src/pay/module/ali/service/trade.pay.service';
import { AlipayConfig, AlipayBaseBizContent } from 'src/pay/module/ali/interfaces/base.interface';
import { AliWapPayService } from 'src/pay/module/ali/service/wap.pay.service';
import { OrderService } from 'src/admin/service/order.service';
import { OrderChannel, OrderStatus } from 'src/common/entities/order.entity';
import { AlipayPrecreateResponse, AlipayTradeRefundResponse, AlipayTradeCreateResponse, AlipayTradeCloseResponse, AlipayTradeQueryResponse, AlipayPrecreateBizContent, AlipayCreateBizContent } from 'src/pay/module/ali/interfaces/trade.interface';
import { AlipayAppBizContent } from 'src/pay/module/ali/interfaces/app.interface';
import { AlipayPageBizContent } from 'src/pay/module/ali/interfaces/page.interface';
import { AlipayWapBizContent } from 'src/pay/module/ali/interfaces/wap.interface';
import { AlipayRefundBizContent } from 'src/pay/module/ali/interfaces/refund.interface';
import { PayDto } from 'src/common/dtos/pay.dto';
import { ApiAlipayService } from './service/api.alipay.service';

@Controller("alipay")
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
    async appPay(@Query() param: PayDto, @Body() body: AlipayAppBizContent):Promise<string> {
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        return this.aliAppPayService.pay(body, alipayConfig);
    }  

    /**
     * pc 支付
     * @param param 
     * @param body 
     */
    @Post("page")
    async pagePay(@Query() param: PayDto, @Body() body: AlipayPageBizContent): Promise<string> {  
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = this.aliPagePaySerice.pay(body, alipayConfig);
        return result
    }

    /**
     * 查询订单
     * @param param 
     * @param body 
     */
    @Post("query")
    async tradePay(@Query() param: PayDto, @Body() body): Promise<AlipayTradeQueryResponse> {  
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
    async precreate(@Query() param: PayDto, @Body() body: AlipayPrecreateBizContent): Promise<AlipayPrecreateResponse> {
        const alipayConfig= await this.apiAlipayService.generateAliPay(param, body);
        const result = await this.alitradePayService.precreate(body, alipayConfig);
        return result
    }

    /**
     * 支付宝手机支付
     * @param param 
     * @param body 
     */
    @Post("wap")
    async wap(@Query() param: PayDto, @Body() body: AlipayWapBizContent): Promise<string> {
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = this.aliwapPayService.pay(body, alipayConfig);
        return result
    }

    /**
     * 支付宝退款接口
     * @param param 
     * @param body 
     */
    @Post("refund")
    async refund(@Query() param: PayDto, @Body() body: AlipayRefundBizContent): Promise<AlipayTradeRefundResponse> {
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
    async create(@Query() param: PayDto, @Body() body: AlipayCreateBizContent): Promise<AlipayTradeCreateResponse> {
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = await this.alitradePayService.create(body, alipayConfig);
        return result
    }

    /**
     * 支付宝订单关闭接口
     * @param param 
     * @param body 
     */
    @Post("close")
    async close(@Query() param: PayDto, @Body() body): Promise<AlipayTradeCloseResponse> {
        const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
        const result = this.alitradePayService.close(body, alipayConfig);
        return result
    }
}