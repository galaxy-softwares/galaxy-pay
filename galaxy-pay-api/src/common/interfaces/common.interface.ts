import { TradeChannel } from '../enum/trade.enum'

export interface FindWhere {
  readonly [key: string]: string | number | boolean
}

// 支付宝基础信息
type AlipayBaseConfig = Record<'appid' | 'certificate', string>

// 支付宝公钥
export type AlipayPublic = Record<'private_key' | 'public_key', string>

// 支付宝公钥证书
export type AlipayPublicCert = AlipayPublic & Record<'app_cert_sn' | 'alipay_root_cert_sn', string>

export type AlipayConfig = AlipayBaseConfig & AlipayPublicCert & AlipayPublic

// 公用参数
type BaseNotifyReturnUrl = Record<'notify_url' | 'return_url', string>

// 微信支付参数
export type WechatConfig = Record<'appid' | 'mch_id' | 'mch_key' | 'app_secret' | 'apiclient_cert', string>

//  通过 & 合并 支付宝和微信的支付参数，最后在合并俩公用参数 notify_url 和 return_url
type PayAppBaseConfig = AlipayConfig & WechatConfig & BaseNotifyReturnUrl

export interface PayappEntity extends PayAppBaseConfig {
  id?: number
  readonly name: string
  software_id: number
  readonly certificate: string
  pay_app_id: string
  pay_secret_key: string
  readonly callback_url: string
  readonly domain_url: string
  readonly channel: TradeChannel
  config: string
}

export interface PayappData extends Omit<PayappEntity, 'config'> {
  config: WechatConfig | Omit<AlipayConfig, 'return_url' | 'notify_url'>
}
