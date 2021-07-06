import { request } from '../utils/request'
import { TradeIF } from '../interface/trade.interface'

export const getTradeList = (parmams: TradeIF.TradeParams) => request<TradeIF.TradeList>('get', '/trade', parmams)
