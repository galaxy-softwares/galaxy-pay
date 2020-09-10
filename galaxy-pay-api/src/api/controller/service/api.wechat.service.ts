import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PayDto } from "src/common/dtos/pay.dto";
import { WechatConfig } from "src/pay/module/wechat/interfaces/base.interface";
import { OrderChannel, OrderStatus } from "src/common/entities/order.entity";
import { SoftwareService } from "src/admin/service/software.service";
import { OrderService } from "src/admin/service/order.service";

@Injectable()
export class ApiWechatService {
    constructor(
        private readonly softwareService: SoftwareService,
        private readonly orderService: OrderService,
    ) {
    }

    /**
     * 生成微信所需的配置参数
     * @param param
     * @Param body
     */
    public async generateWechatConfig(param: PayDto, body):Promise<WechatConfig>  {
        try {           
            const software = await this.softwareService.findSoftwarePay(param.appid, OrderChannel.wechat);
            const order = await this.orderService.findOrder(body.out_trade_no, OrderChannel.wechat)
            const wechatConfig: WechatConfig = JSON.parse(software.wechat);
            if (wechatConfig) {
                if (param.notify_url !== '') {
                    wechatConfig.notify_url = param.notify_url;
                }
                if (param.return_url !== '') {
                    wechatConfig.return_url = param.return_url;
                }
                // 如果数据库中有这个订单
                if (order) {
                    return wechatConfig;
                } else {
                    if (await this.orderService.create({
                        out_trade_no: body.out_trade_no,
                        order_money: body.total_fee / 100,
                        order_chanel: OrderChannel.wechat,
                        order_status: OrderStatus.UnPaid,
                        callback_url: param.callback_url,
                        return_url: param.return_url,
                        notify_url: param.notify_url,
                        appid: param.appid
                    })) {
                        return wechatConfig
                    }
                }
            }
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

}