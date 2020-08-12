import { Controller, Post, Query, Body, HttpException, HttpStatus } from "@nestjs/common";
import { SoftwareService } from "src/admin/service/software.service";
import { WeChatAppletPayService } from "src/pay/module/wechat/service/applet.pay.service";
import { WeChatJSAPIPayService } from "src/pay/module/wechat/service/jsapi.pay.service";
import { WeChatNativePayService } from "src/pay/module/wechat/service/native.pay.service";
import { WeChatWapPayService } from "src/pay/module/wechat/service/wap.pay.service";
import { WechatConfig, Param } from "src/pay/module/wechat/interfaces/base.interface";
import { WeChatMicroPayService } from "src/pay/module/wechat/service/micro.pay.service";
import { WeChatAppPayService } from "src/pay/module/wechat/service/app.pay.service";
import { OrderService } from "src/admin/service/order.service";
import { OrderStatus, OrderChanle } from "src/common/entities/order.entity";
import { WeChatOtherPayOrderReqParam, WeChatAppPayOrderReqParam, WeChatMicroPayOrderReqParam } from "src/pay/module/wechat/interfaces/order.interface";

@Controller("wechat")
export class WechatController {
    constructor(
        private readonly softwareService: SoftwareService,
        private readonly wechatAppletPayService: WeChatAppletPayService,
        private readonly wechatJSAPIPayService: WeChatJSAPIPayService,
        private readonly wechatNativePayService: WeChatNativePayService,
        private readonly wechatWapPayService: WeChatWapPayService,
        private readonly wechatMicroPayService: WeChatMicroPayService,
        private readonly wechatAppPayService: WeChatAppPayService,
        private readonly orderService: OrderService,
    ) {}
    
    /**
     * 生成微信所需的配置参数
     * @param appid
     * @Param body
     */
    private async generateWechatConfig(appid: string, body):Promise<WechatConfig>  {
        try {           
            const order = await this.orderService.findOrder(body.out_trade_no, OrderChanle.wechat)
            const software = await this.softwareService.findSoftwarePay(appid);
            const wechatConfig = JSON.parse(software.wechat);
            if (wechatConfig) {
                // 如果数据库中有这个订单
                if (order) {
                    return wechatConfig;
                } else {
                    console.log(body);
                    if (await this.orderService.create({
                        out_trade_no: body.out_trade_no,
                        order_money: body.total_fee / 100,
                        order_chanle: OrderChanle.wechat,
                        order_status: OrderStatus.UnPaid,
                        callback_url: wechatConfig.callback_url ? '' : '',
                        appid
                    })) {
                        return wechatConfig
                    }
                }
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 微信小程序支付
     * @param param 
     * @param body 详情见WeChatAppletPayService接口
     */
    @Post("applet")
    async appletpay(@Query() param: Param, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.generateWechatConfig(param.appid, body);
        const result = await this.wechatAppletPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信APP支付
     * @param param 
     * @param body 详情见WeChatAppletPayService接口
     */
    @Post("app")
    async app(@Query("appid") appid, @Body() body: WeChatAppPayOrderReqParam) {
        console.log(appid);
        const wechatConfig = await this.generateWechatConfig(appid, body);
        const result = await this.wechatAppPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信jsapi 支付
     * @param param 
     * @param body 
     */
    @Post("jsapi")
    async jsapi(@Query("appid") appid, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.generateWechatConfig(appid, body);
        const result = await this.wechatJSAPIPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信扫码支付
     * @param param 
     * @param body 
     */
    @Post("native")
    async native(@Query("appid") appid, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.generateWechatConfig(appid, body);
        const result = await this.wechatNativePayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 微信h5支付
     * @param param 
     * @param body 
     */
    @Post("h5")
    async h5pay(@Query("appid") appid, @Body() body: WeChatOtherPayOrderReqParam) {
        const wechatConfig = await this.generateWechatConfig(appid, body);
        const result = await this.wechatWapPayService.pay(wechatConfig, body);
        return result
    }

    /**
     * 付款码支付类
     * @param param 
     * @param data 
     */
    @Post("micro")
    async micro(@Query("appid") appid, @Body() body: WeChatMicroPayOrderReqParam) {
        const wechatConfig = await this.generateWechatConfig(appid, body);
        const result = await this.wechatMicroPayService.pay(wechatConfig, body);
        return result
    }
    
}