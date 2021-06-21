import { Entity, Column } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class Software extends Base {
  @Column({
    comment: '项目名称'
  })
  name: string

  @Column({
    comment: '请求回调地址'
  })
  callback_url: string

  @Column({
    comment: '支付成功后跳转地址'
  })
  return_url: string
}
