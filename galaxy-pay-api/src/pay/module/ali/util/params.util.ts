import { Injectable } from '@nestjs/common';
import { AlipayRequestParam } from '../interfaces/base.interface';

/**
 * 支付宝工具
 */
@Injectable()
export class AliParamsUtil {
  /**
   * 对请求参数进行组装、编码
   * @param {Object} params  请求参数
   * @returns {Object}
   */
  encodeParams(
    params: AlipayRequestParam,
  ): {
    unencode: string;
    encode: string;
  } {
    const keys = [];
    for (const k in params) {
      if (params[k] !== undefined && params[k] !== '') keys.push(k);
    }
    keys.sort();
    let unencodeStr = '';
    let encodeStr = '';
    const len = keys.length;
    for (let i = 0; i < len; ++i) {
      const k = keys[i];
      if (i !== 0) {
        unencodeStr += '&';
        encodeStr += '&';
      }
      unencodeStr += k + '=' + params[k];
      encodeStr += k + '=' + encodeURIComponent(params[k]);
    }
    return { unencode: unencodeStr, encode: encodeStr };
  }
}
