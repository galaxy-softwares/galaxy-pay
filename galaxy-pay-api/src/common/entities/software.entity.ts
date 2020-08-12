import { Entity, Column } from 'typeorm';
import { Base } from './base.entity'

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
    comment: "支付完成之后本系统对其他系统的异步回调"
  })
  callback_url: string;

  @Column({
    type: "text",
  })
  wechat: string;

  @Column({
    type: "text",
  })
  alipay: string;
}