import { Entity, Column } from 'typeorm'
import { TradeChannel, TradeStatus, TradeType } from '../../common/enum/trade.enum'
import { Base } from './base.entity'

@Entity()
export class Trade extends Base {
  @Column()
  appid: string

  @Column({
    comment: '支付/退款/打款 编号',
    unique: true
  })
  sys_trade_no: string

  @Column({
    comment: '退款编号(仅在退款时使用)  可以使用sys_trade_no sys_transaction_no',
    default: ''
  })
  refund_trade_no: string

  @Column({
    comment: '交易类型 0 支付 1 退款 2打款',
    type: 'enum',
    enum: TradeType,
    default: TradeType.Trade
  })
  trade_type: TradeType

  @Column({
    comment: '订单状态 0未完成 1完成',
    type: 'enum',
    enum: TradeStatus,
    default: TradeStatus.UnPaid
  })
  trade_status: TradeStatus

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
    comment: '支付完成之后对应的支付宝或者微信异步回调地址'
  })
  notify_url: string

  @Column({
    comment: '订单金额'
  })
  trade_amount: string

  @Column({
    comment: '订单通道（支付宝还是微信）',
    type: 'enum',
    enum: TradeChannel
  })
  trade_channel: TradeChannel

  @Column({
    comment: '支付则对应支付宝得trade_no 微信的 transaction_id。',
    default: ''
  })
  sys_transaction_no: string

  @Column({
    comment: '账单备注'
  })
  trade_body: string
}
