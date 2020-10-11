import { TradeChannel, TradeStatus } from "../enum/trade.enum";


export interface CreateTrade {

    appid: string;
    
    out_trade_no: string;

    trade_status: TradeStatus;

    callback_url: string;

    return_url: string;

    notify_url: string;
    
    trade_amount: string;
    
    trade_channel: TradeChannel;
    
    trade_no?: string;

    trade_body: string;
}