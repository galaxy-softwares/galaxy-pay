import { CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  create_at: number;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  update_at: number;
}
