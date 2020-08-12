import { AlipayBaseBizContent, ExtUserInfo, AgreementSignParams } from "./base.interface";

/**
 * App 请求biz_content
 */
export interface AlipayAppBizContent extends AlipayBaseBizContent {
    timeout_express?: string;
    time_expire?: string;
    goods_type?: string;
    promo_params?: string;
    passback_params?: string;
    extend_params?: {
      sys_service_provider_id?: string;
      hb_fq_num?: string;
      hb_fq_seller_percent?: string;
      industry_reflux_info?: string;
      card_type?: string;
    };
    merchant_order_no?: string;
    enable_pay_channels?: string;
    specified_channel?: string;
    disable_pay_channelsL?: string;
    ext_user_info?: ExtUserInfo,
    business_params?: string;
    agreement_sign_params?: AgreementSignParams
  }