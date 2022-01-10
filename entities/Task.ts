import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, RelationId} from 'typeorm';
import { User } from './User';

@Entity()
export class Task extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  comment!: string;

  @Column()
  process_status!: number;

  @Column({'default': true})
  is_secret!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, user => user.tasks)
  user!: User;

  @RelationId((task: Task) => task.user)
  userId!: string;
}