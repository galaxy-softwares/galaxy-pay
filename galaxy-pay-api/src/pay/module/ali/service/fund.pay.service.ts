import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AlipayRequestParam } from '../interfaces/base.interface';
import {
  AlipayFundTransUniTransferResponse,
  AlipayFundTransUniTransferResponseData,
} from '../interfaces/fund.interface';
import { AliPayBaseService } from './base.service';

@Injectable()
export class fundPayService extends AliPayBaseService {
  /**
   * 支付宝打款给用户
   * @param param AlipayRequestParam
   * @param private_key string
   * @param public_key string
   */
  async transfer(
    param: AlipayRequestParam,
    private_key: string,
    public_key: string,
  ): Promise<AlipayFundTransUniTransferResponse> {
    try {
      const url = this.processParams(param, private_key);
      const { alipay_fund_trans_uni_transfer_response } = await this.requestUtil.post<
        AlipayFundTransUniTransferResponseData
      >(url, public_key);
      return alipay_fund_trans_uni_transfer_response;
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }
}
