import { Entity, Column } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class Software extends Base {
  @Column({
    comment: '项目名称'
  })
  name: string
}
