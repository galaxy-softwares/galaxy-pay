import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AlipayConfig, AlipayRequestParam } from "src/pay/module/ali/interfaces/base.interface";
import * as moment from 'moment';

@Injectable()
export class TransformService  {

    public aliPayParam: AlipayRequestParam = {
        app_id: "",
        method: "",
        format: 'JSON',
        charset: 'utf-8',
        sign_type: "RSA2",
        version: '1.0',
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        return_url: "",
        notify_url: "",
        biz_content: '',
    }

    /**
     * 对支付宝参数进行组装
     */
    public transformAlipayParams<T>(body: T, config: AlipayConfig, method: string): AlipayRequestParam {
        try {
            const data = {
                app_id: config.appid,
                notify_url: config.notify_url,
                return_url: config.return_url,
                method: method,
                biz_content: JSON.stringify({
                    ...body
                }),
            }
            this.aliPayParam = {...this.aliPayParam, ...data}
            return this.aliPayParam;
        } catch(e) {
            throw new HttpException("支付宝参数组装错误", HttpStatus.BAD_REQUEST);
        }

    }
}