import { Entity, Column } from 'typeorm';
import { Base } from './base.entity'

export enum OrderStatus {
    UnPaid  = '0',
    Success = '1',
}

export enum OrderChanle {
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
    comment: '回调地址',
  })
  callback_url:string;

  @Column({
    comment: "订单金额"
  })
  order_money: string;

  @Column({
    comment:"订单通道（支付宝还是微信）",
    type: 'enum', 
    enum: OrderChanle, 
    default: OrderChanle.alipay
  })
  order_chanle: OrderChanle

}