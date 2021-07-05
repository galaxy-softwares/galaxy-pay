import { AlipayConfig, WechatConfig } from 'galaxy-pay-config'
import { TradeChannel } from '../enum/trade.enum'

export interface FindWhere {
  readonly [key: string]: string | number | boolean
}

type BasePayParams = Record<'pay_secret_key' | 'domain_url' | 'callback_url', string>

export type PayAppConfig = AlipayConfig | WechatConfig

export interface PayappEntity {
  id?: number
  name: string
  software_id: number
  pay_app_id: string
  pay_secret_key: string
  callback_url: string
  domain_url: string
  notify_url: string
  return_url: string
  channel: TradeChannel
  config: string
}

export interface PayappData extends Omit<PayappEntity, 'config'> {
  config:
    | Omit<WechatConfig, 'return_url' | 'notify_url' | 'callback_url'>
    | Omit<AlipayConfig, 'return_url' | 'notify_url' | 'callback_url'>
}

// 微信支付配置
export type PayWechatConfig = BasePayParams & Record<'config', WechatConfig>

// 支付宝支付配置
export type PayAlipayConfig = BasePayParams & Record<'config', AlipayConfig>

export type PayConfig = PayWechatConfig | PayAlipayConfig
