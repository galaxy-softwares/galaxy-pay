import { Injectable, HttpService, Inject, HttpException, HttpStatus } from '@nestjs/common';
import * as axios from 'axios';
import { AliSignUtil } from './sign.util';
import { AliParamsUtil } from './params.util';
import { AlipayConfig } from '../interfaces/base.interface';


/**
 * 支付宝支付请求
 */
@Injectable()
export class AliRequestUtil {
    constructor(
        @Inject(HttpService) private readonly httpService: HttpService,
        @Inject(AliParamsUtil) protected readonly paramsUtil: AliParamsUtil,
        @Inject(AliSignUtil) protected readonly singinUtil: AliSignUtil,
    ) { }

    /**
     * 支付宝get请求
     *
     * @param url 请求地址
     * @param param 请求参数
     * @param config 支付参数
     */
    async post<T>(url: string, config: AlipayConfig, axiosConfig?: axios.AxiosRequestConfig): Promise<T> {
        try {
            const { data } = await this.httpService.post<T>(`${url}`, axiosConfig).toPromise();
            if (!this.singinUtil.responSignVerify(data, config.public_key)) {
                throw new HttpException('支付宝支付接口返回签名有误', HttpStatus.BAD_REQUEST);
            }
            return data;
        } catch(error) {
            throw new HttpException('支付包请求接口时出现网络异常：' + error.toString(), HttpStatus.BAD_REQUEST);
        }
    }   

}