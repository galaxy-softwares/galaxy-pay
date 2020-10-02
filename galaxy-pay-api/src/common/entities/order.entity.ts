import { Entity, Column } from 'typeorm';
import { Base } from './base.entity'

export enum OrderStatus {
    UnPaid  = '0',
    Success = '1',
}

export enum OrderChannel {
    wechat  = "wechat",
    alipay = "alipay",
}

export enum OrderType {
  refund  = "refund",
  pay = "pay",
  withdrawal = "withdrawal"
}


@Entity()
export class Order extends Base {

  @Column()
  appid: string;

  @Column({
    comment: "订单编号",
    unique: true
  })
  out_trade_no: string;

  @Column({ comment: '订单类型 退款 提现 付款', type: 'enum', enum: OrderType, default: OrderType.pay})
  order_type: string;

  @Column({ comment: '订单状态', type: 'enum', enum: OrderStatus, default: OrderStatus.UnPaid})
  order_status: OrderStatus;

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
    default: '',
  })
  order_money: string;

  @Column({
    comment: "退款金额",
    default: ''
  })
  order_refund_money: string;

  @Column({
    comment: "提现金额",
    default: '0',
  })  
  order_withdrawal_money: string;

  @Column({
    comment:"订单通道（支付宝还是微信）",
    type: 'enum', 
    enum: OrderChannel, 
  })
  order_channel: OrderChannel

  @Column({
    comment: "支付订单号",
    default: "",  
  })
  trade_no: string;
}