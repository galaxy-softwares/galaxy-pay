export namespace TradeIF {
  export interface Trade {
    id?: string
    sys_trade_no: string
    sys_transaction_no: string
    pay_app_name: string
    software_name: string
    trade_amount: number
    trade_status: string
    trade_channel: string
  }
  export type TradeParams = Record<'sys_trade_no' | 'channel', string>
  export type TradeList = Array<Trade>
}
