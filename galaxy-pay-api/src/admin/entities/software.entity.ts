import { Entity, Column } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Software extends Base {
  @Column()
  merchant_id: string;

  @Column({
    comment: '系统随机分配APPID,用于请求的时使用',
  })
  appid: string;

  @Column({
    comment: '系统随机生成的字符串, 用于双方系统加密使用',
  })
  secret_key: string;

  @Column({
    comment: '项目名称',
  })
  name: string;

  @Column({
    comment: '请求白名单地址,多个逗号分开',
    type: 'text',
  })
  domain_url: string;

  @Column({
    type: 'text',
  })
  config: string;

  @Column()
  notify_url: string;

  @Column({
    unique: true,
  })
  callback_url: string;

  @Column()
  return_url: string;
}
