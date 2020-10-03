import { Entity, Column } from 'typeorm';
import { TradeChannel } from '../enum/trade.enum';
import { Base } from './base.entity'

@Entity()
export class Software extends Base {

  @Column()
  appid: string;

  @Column()
  name: string;

  @Column({
    comment: "此乃系统随机生成的字符串切记要好好保存！"
  })
  app_secret: string;

  @Column({
    comment: "请求白名单地址，仅限一个url谢谢！"
  })
  domain_url: string;

  @Column({
    type: "text",
  })
  wechat: string;

  @Column({
    type: "text",
  })
  alipay: string;

  @Column({
    comment:"支付宝还是微信",
    type: 'enum', 
    enum: TradeChannel, 
    default: TradeChannel.alipay
  })
  channel: TradeChannel
}