/**
 * transfer 请求biz_content
 */
export interface AlipayTransferBizContent {
  out_biz_no: string;
  trans_amount: string;
  product_code: string;
  biz_scene?: string;
  order_title?: string;
  original_order_id?: string;
  payee_info: {
    identity: string;
    identity_type: string;
    name: string;
  };
  remark: string;
  business_params: string;
}

export interface AlipayFundTransUniTransferResponse {
  code: string;
  msg: string;
  out_biz_no: string;
  order_id: string;
  pay_fund_order_id: string;
  status: string;
  trans_date: string;
}

export interface AlipayFundTransUniTransferResponseData {
  sign: string;
  alipay_fund_trans_uni_transfer_response: AlipayFundTransUniTransferResponse;
}
