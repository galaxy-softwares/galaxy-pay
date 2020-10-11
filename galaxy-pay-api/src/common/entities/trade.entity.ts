import { Entity, Column } from 'typeorm';
import { TradeChannel, TradeStatus } from '../enum/trade.enum';
import { Base } from './base.entity'

@Entity()
export class Trade extends Base {

  @Column()
  appid: string;

  @Column({
    comment: "订单编号",
    unique: true
  })
  out_trade_no: string;

  @Column({ comment: '订单状态', type: 'enum', enum: TradeStatus, default: TradeStatus.UnPaid})
  trade_status: TradeStatus;

  @Column({
    comment: '支付完成之后，本系统对你的系统回调通知',
    default: ""
  })
  callback_url:string;

  @Column({
    comment: '支付完成之后对应的支付宝或者微信同步回调地址',
    default: '',
  })
  return_url:string;

  @Column({
    comment: '支付完成之后对应的支付宝或者微信异步回调地址',
  })
  notify_url:string;

  @Column({
    comment: "订单金额",
  })
  trade_amount: string;

  @Column({
    comment:"订单通道（支付宝还是微信）",
    type: 'enum', 
    enum: TradeChannel,
  })
  trade_channel: TradeChannel

  @Column({
    comment: "支付订单号",
    default: "",  
  })
  trade_no: string;

  @Column({
    comment: "账单备注",
  })
  trade_body: string;
}