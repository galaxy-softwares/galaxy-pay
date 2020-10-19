import { Injectable, Inject } from '@nestjs/common';
import { AliRequestUtil } from '../util/request.util';
import { AliParamsUtil } from '../util/params.util';
import { AliSignUtil } from '../util/sign.util';
import * as moment from 'moment';
import { AlipayRequestParam } from '../interfaces/base.interface';

@Injectable()
export class AliPayBaseService {
  protected alipay_gate_way = 'https://openapi.alipay.com/gateway.do?';

  public param: AlipayRequestParam = {
    app_id: '',
    method: '',
    format: 'JSON',
    charset: 'utf-8',
    sign_type: 'RSA2',
    version: '1.0',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    return_url: '',
    notify_url: '',
    biz_content: '',
  };

  constructor(
    @Inject(AliRequestUtil) protected readonly requestUtil: AliRequestUtil,
    @Inject(AliParamsUtil) protected readonly paramsUtil: AliParamsUtil,
    @Inject(AliSignUtil) protected readonly singinUtil: AliSignUtil,
  ) {}

  /**
   * 对请求参数进行组装、编码、签名，返回已组装好签名的参数字符串
   * @param params 请求参数
   * @param private_key 支付密钥
   *
   * @returns {String}
   */
  processParams(params: AlipayRequestParam, private_key: string): string {
    const ret = this.paramsUtil.encodeParams(params);
    const sign = this.singinUtil.sign(ret.unencode, private_key);
    if (params.method === 'alipay.trade.app.pay') {
      return `${ret.encode}&sign=` + encodeURIComponent(sign);
    } else {
      return `${this.alipay_gate_way}${ret.encode}&sign=` + encodeURIComponent(sign);
    }
  }
}
