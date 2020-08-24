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


@Entity()
export class Order extends Base {

  @Column()
  appid: string;

  @Column({
    comment: "订单编号",
    unique: true
  })
  out_trade_no: string;

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
    comment: "订单金额"
  })
  order_money: string;

  @Column({
    comment:"订单通道（支付宝还是微信）",
    type: 'enum', 
    enum: OrderChannel, 
  })
  order_channel: OrderChannel

}