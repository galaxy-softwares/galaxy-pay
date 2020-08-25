import { Controller, Post, Query, Body, HttpException, HttpStatus } from "@nestjs/common";
import { WeChatAppletPayService } from "src/pay/module/wechat/service/applet.pay.service";
import { WeChatJSAPIPayService } from "src/pay/module/wechat/service/jsapi.pay.service";
import { WeChatNativePayService } from "src/pay/module/wechat/service/native.pay.service";
import { WeChatWapPayService } from "src/pay/module/wechat/service/wap.pay.service";
import { WeChatMicroPayService } from "src/pay/module/wechat/service/micro.pay.service";
import { WeChatAppPayService } from "src/pay/module/wechat/service/app.pay.service";
import { WeChatOtherPayOrderReqParam, WeChatAppPayOrderReqParam, WeChatMicroPayOrderReqParam } from "src/pay/module/wechat/interfaces/order.interface";
import { PayDto } from "src/common/dtos/pay.dto";

import { ApiWechatService } from './service/api.wechat.service';

@Controller("wechat")
export class WechatController {
    constructor(
        private readonly wechatAppletPayService: WeChatAppletPayService,
        private readonly wechatJSAPIPayService: WeChatJSAPIPayService,
        private readonly wechatNativePayService: WeChatNativePayService,
        private readonly wechatWapPayService: WeChatWapPayService,
        private readonly wechatMicroPayService: WeChatMicroPayService,
        private readonly wechatAppPayService: WeChatAppPayService,
        private readonly apiWechatSerice: ApiWechatService,
    ) {}
    

    /**
     * 微信小程序支付
     * @param param 
     * @param body 详情见WeChatAppletPayService接口
     */
    @Post("applet")
    async appletpay(@Query() param: PayDto, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.apiWechatSerice.generateWechatConfig(param, body);
        const result = await this.wechatAppletPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信APP支付
     * @param param 
     * @param body 详情见WeChatAppletPayService接口
     */
    @Post("app")
    async app(@Query() param: PayDto, @Body() body: WeChatAppPayOrderReqParam) {
        const wechatConfig = await this.apiWechatSerice.generateWechatConfig(param, body);
        const result = await this.wechatAppPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信jsapi 支付
     * @param param 
     * @param body 
     */
    @Post("jsapi")
    async jsapi(@Query() param: PayDto, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.apiWechatSerice.generateWechatConfig(param, body);
        const result = await this.wechatJSAPIPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信扫码支付
     * @param param 
     * @param body 
     */
    @Post("native")
    async native(@Query() param: PayDto, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.apiWechatSerice.generateWechatConfig(param, body);
        const result = await this.wechatNativePayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信h5支付
     * @param param 
     * @param body 
     */
    @Post("h5")
    async h5pay(@Query() param: PayDto, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.apiWechatSerice.generateWechatConfig(param, body);
        const result = await this.wechatWapPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 付款码支付类
     * @param param 
     * @param data 
     */
    @Post("micro")
    async micro(@Query() param: PayDto, @Body() body: WeChatMicroPayOrderReqParam) {
        const wechatConfig = await this.apiWechatSerice.generateWechatConfig(param, body);
        const result = await this.wechatMicroPayService.pay(wechatConfig, body);
        return result
    }
    
}