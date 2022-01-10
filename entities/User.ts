import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { Task } from './Task';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({'default': ''})
  mail_address!: string;

  @Column({'default': ''})
  password!: string;

  @Column({'default': ''})
  google_id!: string;

  @Column()
  display_name!: string;

  @Column({'default': true})
  is_active!: boolean;

  @Column({'default': false})
  is_admin!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];
}