import { AlipayBaseBizContent, AlipayTradeBase } from "./base.interface"

/**
 * 支付宝biz_content 请求接口
 */
export default interface AlipayTradeBizContent extends AlipayBaseBizContent {
  extend_params?: {
    sys_service_provider_id?: string
    industry_reflux_info?: string;
    card_type?: string;
  };
  operator_id?: string;
  terminal_id?: string;
  timeout_express?: string;
  auth_confirm_mode?: string;
  terminal_params?: string;
  promo_params: {
    actual_order_time?: string;
  }
  advance_payment_type?: string;
  query_options: string[];
  request_org_pid?: string;
  is_async_pay?: boolean;
}

/**
 * 支付宝预创建接口
 */
export interface AlipayPrecreateBizContent extends AlipayBaseBizContent {
  seller_id?: string;
  discountable_amount?: string;
  operator_id?: string;
  disable_pay_channels?: string;
  enable_pay_channels?: string;
  terminal_id?: string;
  extend_params?: {
    sys_service_provider_id?: string;
    card_type?: string;
  };
  timeout_express?: string;
  settle_info?: {
    settle_detail_infos: {
      trans_in_type: string;
      trans_in: string;
      summary_dimension?: string;
      settle_entity_id?: string;
      settle_entity_type?: string;
      amount: string;
    };
    settle_period_time: string;
  };
  merchant_order_no?: string;
  business_params?: {
    campus_card?: string;
    card_type?: string;
    actual_order_time?: string;
  };
  qr_code_timeout_express?: string;
}

/**
 * create 请求biz_content
 */
export interface AlipayCreateBizContent extends AlipayBaseBizContent  {
  discountable_amount?: string;
  buyer_id?: string;
  operator_id?: string;
  terminal_id?: string;
  extend_params?: {
    sys_service_provider_id?: string;
    hb_fq_num?: string;
    hb_fq_seller_percent?: string;
    industry_reflux_info?: string;
    card_type?: string;
  };
  timeout_express?: string;
  settle_info?: {
    settle_detail_infos: {
      trans_in_type: string;
      trans_in: string;
      summary_dimension?: string;
      settle_entity_id?: string;
      settle_entity_type?: string;
      amount: string;
    }
    settle_period_time: string;
  };
  logistics_detail?: {
    logistics_type?: string;
  };
  business_params?: {
    campus_card?: string;
    card_type?: string;
    actual_order_time?: string;
  };
  receiver_address_info?: {
    name?: string;
    address?: string;
    mobile?: string;
    zip?: string;
    division_code?: string;
  }
}

/**
 * 支付宝订单查询接口
 */
export interface AlipayTradeQueryResponseData {
  sign: string;
  alipay_trade_query_response: AlipayTradeQueryResponse
}

export interface AlipayTradeQueryResponse extends AlipayTradeBase {
  message: string;
  buyer_logon_id: string;
  buyer_pay_amount: string;
  buyer_user_id: string;
  buyer_user_type: string;
  invoice_amount: string;
  point_amount: string;
  receipt_amount: string;
  send_pay_date: string;
  total_amount: string;
  trade_status: string;
}


/**
 * 支付宝退款接口
 */
export interface AlipayTradeRefundResponseData {
  sign: string;
  alipay_trade_refund_response: AlipayTradeRefundResponse
}

export interface AlipayTradeRefundResponse extends AlipayTradeBase {
  buyer_logon_id: string,
  fund_change: string,
  refund_fee: number,
  refund_currency: string,
  gmt_refund_pay: string,
  refund_detail_item_list: Array<any>
  store_name: string,
  buyer_user_id: string,
  refund_preset_paytool_list: any,
  refund_settlement_id: string,
  present_refund_buyer_amount: string,
  present_refund_discount_amount: string,
  present_refund_mdiscount_amount: string
}


/**
 * 统一收单交易创建接口
 */
export type AlipayTradeCreateResponse = AlipayTradeBase

/**
 * 统一收单交易创建接口
 */
export interface AlipayTradeCreateResponseData {
  sign: string;
  alipay_trade_create_response: AlipayTradeCreateResponse
}

export type AlipayTradeCloseResponse = AlipayTradeBase

export interface AlipayTradeCloseResponseData {
  sign: string;
  alipay_trade_close_response: AlipayTradeCloseResponse
}


/**
 * 支付宝扫码支付订单创建
 */
export interface AlipayPrecreateResponse extends AlipayTradeBase {
  qr_code: string;
}

/**
 * 支付宝订单创建返回得接口
 */
export interface AlipayPrecreateResponseData {
  sign: string;
  alipay_trade_precreate_response: AlipayPrecreateResponse
}