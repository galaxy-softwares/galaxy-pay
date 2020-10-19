import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Base } from './base.entity';
import * as crypto from 'crypto-js';

@Entity()
export class User extends Base {
  @Column({
    type: 'char',
    length: 20,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 60,
  })
  password: string;

  @Column()
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    this.password = crypto.MD5(this.password).toString();
  }
}
