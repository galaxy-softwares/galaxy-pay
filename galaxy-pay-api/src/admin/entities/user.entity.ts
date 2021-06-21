import { Entity, Column } from 'typeorm'
import { Base } from './base.entity'

@Entity()
export class User extends Base {
  @Column({
    type: 'char',
    length: 20,
    unique: true
  })
  username: string

  @Column({
    type: 'varchar',
    length: 60
  })
  password: string

  @Column()
  email: string
}
