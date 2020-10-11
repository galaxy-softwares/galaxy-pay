import { Entity, Column } from 'typeorm';
import { TradeChannel, TradeStatus } from '../enum/trade.enum';
import { Base } from './base.entity'

@Entity()
export class RefundTrade extends Base {

  @Column()
  appid: string;

  @Column({
    comment: "订单编号",
    unique: true
  })
  out_trade_no: string;

  @Column({
    comment: "完成之后的通知url",
    default: '',
  })
  callback_url: string;
  
  @Column({ comment: '订单状态', type: 'enum', enum: TradeStatus, default: TradeStatus.UnPaid})
  trade_status: TradeStatus;

  @Column({
    comment: "退款账单金额",
  })
  trade_amount: string;

  @Column({
    comment: "需要退款的金额",
  })
  trade_refund_amount: string;

  @Column({
    comment:"订单通道（支付宝还是微信）",
    type: 'enum', 
    enum: TradeChannel,
  })
  trade_channel: TradeChannel

  @Column({
    comment: "退款订单号",
    default: "",  
  })
  trade_no: string;

  @Column({
    comment: "账单备注",
    default: "",  
  })
  trade_body: string;
}