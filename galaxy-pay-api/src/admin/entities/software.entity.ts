import { Entity, Column } from 'typeorm';
import { TradeChannel } from '../../common/enum/trade.enum';
import { Base } from './base.entity';

@Entity()
export class Software extends Base {
  @Column()
  appid: string;

  @Column()
  name: string;

  @Column({
    comment: '系统随机生成的字符串, 用于双方系统加密使用',
  })
  secret_key: string;

  @Column({
    comment: '请求白名单地址,多个逗号分开',
  })
  domain_url: string;

  @Column({
    type: 'text',
  })
  wechat: string;

  @Column({
    type: 'text',
  })
  alipay: string;

  @Column({
    comment: '支付宝还是微信',
    type: 'enum',
    enum: TradeChannel,
    default: TradeChannel.alipay,
  })
  channel: TradeChannel;
}
