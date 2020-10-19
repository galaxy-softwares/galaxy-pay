import { TradeChannel, TradeStatus } from '../enum/trade.enum';

export interface CreateRefundTrade {
  appid: string;

  out_trade_no: string;

  trade_status: TradeStatus;

  callback_url: string;

  trade_amount: string;

  trade_channel: TradeChannel;

  trade_refund_amount: string;

  trade_no?: string;

  trade_body: string;
}
