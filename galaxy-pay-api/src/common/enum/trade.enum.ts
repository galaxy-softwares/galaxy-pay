export enum TradeStatus {
    UnPaid  = '0',
    Success = '1',
}

export enum TradeChannel {
  wechat  = "wechat",
  alipay = "alipay",
}

export enum TradeType {
  income  = "0", // 收入
  expenditure = "1", // 支出
}

export enum TradeAccountType {
  payment = "0",
  withdrawal = "1",
  refund = '2'
}