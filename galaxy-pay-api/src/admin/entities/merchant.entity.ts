import { TradeChannel } from 'src/common/enum/trade.enum';
import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Merchant extends Base {
  @Column()
  name: string;

  @Column({
    comment: '商户配置',
    type: 'text',
  })
  config: string;

  @Column({
    comment: '支付类型',
    type: 'enum',
    enum: TradeChannel,
    default: TradeChannel.alipay,
  })
  channel: TradeChannel;
}
