export interface AlipayConfig {
    app_id: string;
    private_key: string;
    public_key: string;
    debug: boolean;
    return_url?: string;
    notify_url?: string;
}

/**
 * 支付宝公共请求参数（支付宝支付请求公共参数全部一致）
 *  https://opendocs.alipay.com/apis/api_1 （支付宝alipay.treade.pay 统一收单交易支付接口）
 */
export interface AlipayRequestParam {
  app_id: string,
  method: string,
  format?: string,
  charset: string,
  sign_type: string,
  sign?: string,
  timestamp: string,
  return_url?: string,
  version: string,
  notify_url?: string,
  app_auth_token?: string,
  biz_content: string
}

/**
 * 公共请求
 */
export interface AlipayBaseBizContent {
  total_amount: number;
  out_trade_no: string;
  subject: string;
  product_code: string;
  goods_detail?: Array<AlipayBaseGoodsDetail>,
  body?: string;
  store_id?: string;
}

/**
 * 商品详情
 */
export interface AlipayBaseGoodsDetail {
  goods_id: string;
  goods_name: string;
  quantity: number;
  price: number;
  goods_category?: string;
  categories_tree?: string;
  body?: string;
  show_url?: string;
}

/**
 * 支付宝公共响应接口
 */
export interface AlipayTradeBase {
  code: string,
  msg: string,
  trade_no: string,
  out_trade_no: string;
  sub_code: string;
  sub_msg: string;
}


export interface ExtUserInfo {
  name?: string;
  mobile?: string;
  cert_type?: string;
  cert_no?: string;
  min_age?: string;
  fix_buyer?: string;
  need_check_info?: string;
}

export interface AgreementSignParams {
  personal_product_code?: string;
  sign_scene?: string;
  external_agreement_no?: string;
  external_logon_id?: string;
  access_params: {
    channel: string;
  }
  sub_merchant?: {
    sub_merchant_id?: string;
    sub_merchant_name?: string;
    sub_merchant_service_name?: string;
    sub_merchant_service_description?: string;
  },
  period_rule_params?: {
    period_type: string;
    period: number;
    execute_time: string;
    single_amount: number;
    total_amount: number;
    total_payments?: number;
  }
  allow_huazhi_degrade?: boolean;
  sign_notify_url?: string;
}