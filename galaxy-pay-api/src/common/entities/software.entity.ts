import { Entity, Column } from 'typeorm';
import { Base } from './base.entity'
import { OrderChannel } from './order.entity';

@Entity()
export class Software extends Base {

  @Column()
  appid: string;

  @Column()
  name: string;



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
    enum: OrderChannel, 
    default: OrderChannel.alipay
  })
  channel: OrderChannel
}