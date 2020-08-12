import { ExtUserInfo, AlipayBaseBizContent  } from "./base.interface";

/**
 * page 请求biz_content
 */
export interface AlipayPageBizContent extends AlipayBaseBizContent {
    time_expire?: string;
    passback_params?: string;
    extend_params?: {
      sys_service_provider_id?: string;
      hb_fq_num?: string;
      hb_fq_seller_percent?: string;
      industry_reflux_info?: string;
      card_type?: string;
    };
    goods_type?: string;
    timeout_express?: string;
    promo_params?: string;
    royalty_info?: {
      royalty_type?: string;
      royalty_detail_infos: Array<{serial_no?: number}>
      trans_in_type?: string;
      batch_no?: string;
      out_relation_id?: string;
      trans_out_type?: string;
      trans_out?: string;
      trans_in?: string;
      amount?: string;
      desc?: string;
      amount_percentage?: string;
    }
    sub_merchant?: {
      merchant_id: string;
      merchant_type?: string;
    }
    merchant_order_no?: string;
    enable_pay_channels?: string;
    disable_pay_channels?: string;
    qr_pay_mode?: string;
    qrcode_width?: string;
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
    }
    invoice_info: {
      key_info: {
        is_support_invoice: boolean;
        invoice_merchant_name: boolean;
        tax_num: boolean;
      },
      details: string;
    }
    agreement_sign_params: {
      personal_product_code: string;
      sign_scene?: string;
      external_agreement_no?: string;
      external_logon_id?: string;
      sign_validity_period?: string;
      third_party_type?: string;
      buckle_app_id?: string;
      buckle_merchant_id?: string;
      promo_params?: string;
    }
    integration_type?: string;
    request_from_url?: string;
    business_params?: string;
    ext_user_info?: ExtUserInfo
  }