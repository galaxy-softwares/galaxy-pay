import { Injectable } from '@nestjs/common';
import crypto = require('crypto');
import { AlipayRequestParam } from '../interfaces/base.interface';

/**
 * 支付宝工具
 */
@Injectable()
export class AliSignUtil {
    
    /**
     * 潜拷贝
     * @param obj 
     */
    copy (obj) {
        const ret = {};
        for(const k in obj) {
            ret[k] = obj[k];
        }
        return ret;
    }

    encodeParams(params: AlipayRequestParam): {
        unencode: string,
        encode: string
    } {
        const keys = [];
        for(const k in params) {
            if (params[k] !== undefined && params[k] !== "") keys.push(k);
        }
        keys.sort();
        let unencodeStr = "";
        let encodeStr = "";
        const len = keys.length;
        for(let i = 0; i < len; ++i) {
            const k = keys[i];
            if(i !== 0) {
                unencodeStr += '&';
                encodeStr += '&';
            }
            unencodeStr += k + '=' + params[k];
            encodeStr += k + '=' + encodeURIComponent(params[k]);
        }
        return { unencode:unencodeStr, encode:encodeStr };
    }

    /**
    * 对字符串进行签名验证
    * @param {String} str 要验证的参数字符串
    * @param {String} sign 要验证的签名
    * @param {String} publicKey 支付宝公钥
    * @returns {Boolean}
    */
    signVerify(str: string, sign: string, publicKey: string): boolean {
        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(str, 'utf8');
        const result = verify.verify(publicKey, sign, 'base64');
        return result;
    }

    responSignVerify(response, public_key: string): boolean {
        const ret: any = this.copy(response);
        const sign = ret['sign'];
        delete ret.sign;
        delete ret.sign_type;
        const response_type = [
            'alipay_trade_app_pay_response',
            'alipay_trade_create_response',
            'alipay_trade_query_response',
            'alipay_trade_refund_response',
            'alipay_trade_precreate_response',
            'alipay_trade_pay_response',
            'alipay_trade_cancel_response',
            'alipay_trade_close_response',
            'alipay_trade_order_settle_response',
            'alipay_trade_fastpay_refund_query_response',
            'alipay_fund_trans_uni_transfer_response'
        ];
        const res = response_type.reduce(function(prev, currentType){
            if (currentType in ret) return ret[currentType];
            return prev;
        }, null)

        if(res) {
            // 如果字符串中包含“http://”的正斜杠， 需要进行转义
            // 譬如https://qr.alipay.com/bax01627rhk9yrptdnqc000a  需要转义成 "https:\\/\\/qr.alipay.com\\/bax01627rhk9yrptdnqc000a"

            // 你以为转成这样就好了？？？天真
            // 实际上是 https:\/\/qr.alipay.com\/bax05478ub8dckcl8ddq00cf 这样的..妈蛋~
            return this.signVerify(JSON.stringify(res).replace(/\//g,"\\/"), sign, public_key)
        } else {
            const tmp = this.encodeParams(ret);
            return this.signVerify(tmp.unencode, sign, public_key);
        }
    }

    /**
    * 签名
    * 对字符串进行签名
    * @param {String} str 要签名的字符串
    * @param {String} privateKey 商户应用私钥
    * @param {String} [signType] 签名类型
    * @returns {String}
    */
    sign(str:string, private_key: string): string {
      const sha = crypto.createSign('RSA-SHA256');
      sha.update(str, 'utf8');
      return sha.sign(private_key, 'base64');
    }
}


