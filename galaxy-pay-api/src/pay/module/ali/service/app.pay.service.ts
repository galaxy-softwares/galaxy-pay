import { Injectable } from '@nestjs/common';
import { AliPayBaseService } from './base.service';
import { AlipayConfig, AlipayRequestParam } from '../interfaces/base.interface';

@Injectable()
export class AliAppPayService extends AliPayBaseService {
  /**
   * 支付宝app 服务端支付
   * @param param AlipayRequestParam
   * @param config AlipayConfig
   */
  async pay(param: AlipayRequestParam, config: AlipayConfig): Promise<any> {
    return this.processParams(param, config.private_key);
  }
}
