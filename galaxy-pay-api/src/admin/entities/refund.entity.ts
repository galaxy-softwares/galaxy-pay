import { TradeChannel, TradeStatus } from 'src/common/enum/trade.enum'
import { Column, Entity } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class Refund extends Base {
  @Column()
  pay_app_id: string

  @Column({
    comment: '退款订单号',
    unique: true
  })
  sys_refund_no: string

  @Column({
    comment: '退款内部交易号',
    default: ''
  })
  sys_transaction_no: string

  @Column({
    comment: '退款原因',
    type: 'text'
  })
  refund_body: string

  @Column({
    comment: '请求完成之后，本系统对你的系统回调通知',
    default: ''
  })
  callback_url: string

  @Column({
    comment: '请求完成之后对应的支付宝或者微信同步回调地址',
    default: ''
  })
  return_url: string

  @Column({
    comment: '支付完成之后对应的支付宝或者微信异步回调地址',
    default: ''
  })
  notify_url: string

  @Column({
    comment: '订单退款金额'
  })
  refund_amount: string

  @Column({
    comment: '订单总金额'
  })
  total_amount: string

  @Column({
    comment: '退款通道（支付宝还是微信）',
    type: 'enum',
    enum: TradeChannel
  })
  refund_channel: TradeChannel

  @Column({
    comment: '退款状态',
    default: 0
  })
  status: TradeStatus
}
