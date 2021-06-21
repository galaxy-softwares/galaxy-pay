import { TradeChannel } from 'src/common/enum/trade.enum'
import { Entity, Column } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class Payapp extends Base {
  @Column({
    comment: '项目名称'
  })
  name: string

  @Column({
    comment: '归属项目'
  })
  softwar_id: string

  @Column({
    comment: '系统随机分配APPID,用于请求的时使用'
  })
  payapp_id: string

  @Column({
    comment: '系统随机生成的字符串, 用于双方系统加密使用'
  })
  payapp_secret_key: string

  @Column({
    comment: '应用类型'
  })
  payapp_type: string

  @Column({
    comment: '回调地址'
  })
  callback_url: string

  @Column({
    comment: '请求白名单地址,多个逗号分开',
    type: 'text'
  })
  domain_url: string

  @Column({
    comment: '支付类型',
    type: 'enum',
    enum: TradeChannel,
    default: TradeChannel.alipay
  })
  channel: TradeChannel

  @Column({
    comment: '支付应用配置',
    type: 'text'
  })
  config: string
}
