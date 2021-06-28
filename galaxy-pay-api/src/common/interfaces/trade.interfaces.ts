import { TradeChannel, TradeStatus, TradeType } from '../enum/trade.enum'

export interface CreateTrade {
  pay_app_id: string

  sys_trade_no: string

  trade_status: TradeStatus

  refund_trade_no: string

  trade_type: TradeType

  callback_url: string

  return_url: string

  notify_url: string

  trade_amount: string

  trade_channel: TradeChannel

  sys_transaction_no?: string

  trade_body: string
}
