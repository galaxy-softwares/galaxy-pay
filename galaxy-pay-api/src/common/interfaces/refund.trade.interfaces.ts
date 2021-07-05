import { TradeChannel, TradeStatus } from '../enum/trade.enum'

export interface CreateRefundTrade {
  appid: string

  out_trade_no: string

  trade_status: TradeStatus

  callback_url: string

  trade_amount: string

  trade_channel: TradeChannel

  trade_refund_amount: string

  trade_no?: string

  trade_body: string
}

type AlipayBaseConfig = Record<'appid' | 'return_url' | 'notify_url' | 'certificate', string>

// 支付宝公钥
type AlipayPublic = Record<'private_key' | 'public_key', string>

// 支付宝公钥证书
type AlipayPublicCert = AlipayPublic &
  Record<'app_cert_public_key' | 'alipay_cert_public_key_rsa2' | 'alipay_root_cert', string>

export type AlipayConfig = AlipayBaseConfig & Partial<AlipayPublicCert> & AlipayPublic

export interface AlipayBodyData extends AlipayConfig {
  id?: number
  name: string
  software_id: number
  pay_app_id: string
  pay_secret_key: string
  domain_url: string
  channel: TradeChannel
}
