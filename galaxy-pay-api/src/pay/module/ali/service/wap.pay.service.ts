import { Injectable } from '@nestjs/common';
import { AliPayBaseService } from './base.service';
import { AlipayRequestParam } from '../interfaces/base.interface';

@Injectable()
export class AliWapPayService extends AliPayBaseService {
  /**
   * h5 支付
   * 支付宝支付参数拼接
   * @param config AlipayConfig
   * @param body AlipayPageBizContent
   */
  pay(param: AlipayRequestParam, private_key: string): string {
    return this.processParams(param, private_key);
  }
}
