import { AlipayBaseBizContent, ExtUserInfo } from "./base.interface";

/**
 * Wap 请求biz_content
 */
export interface AlipayWapBizContent extends AlipayBaseBizContent {
  timeout_express?: string;
  time_expire?:string;
  auth_token?: string;
  goods_type?: string;
  quit_url?: string;
  passback_params?: string;
  promo_params?: string;
  extend_params?: {
    sys_service_provider_id?: string;
    hb_fq_num?: string;
    hb_fq_seller_percent?: string;
    industry_reflux_info?: string;
    card_type?: string;
  };
  merchant_order_no?: string;
  enable_pay_channels?: string;
  disable_pay_channels?: string;
  specified_channel?: string;
  business_params?: string;
  ext_user_info?: ExtUserInfo
}