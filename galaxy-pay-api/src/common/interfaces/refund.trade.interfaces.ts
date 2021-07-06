import { TradeChannel, TradeStatus } from '../enum/trade.enum'

export interface CreateRefund {
  id?: number
  pay_app_id: string
  sys_refund_no: string
  sys_transaction_no?: string
  refund_body: string
  callback_url: string
  return_url: string
  notify_url: string
  refund_amount: string
  total_amount: string
  channel: TradeChannel
  status: TradeStatus
}
