import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Media } from './file.entity';

export enum TipType {
  SLEEPING = 'sleeping',
  BREATHING = 'breathing',
  MUSCLE = 'muscle',
  GROUNDING = 'grounding',
}

@Entity()
export class Tip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', length: 40 })
  amh_title: string;

  @Column({ type: 'varchar' })
  amh_description: string;

  @OneToMany(() => Media, (media) => media.tip, {
    eager: true,
  })
  media: Media[];

  @Column({
    type: 'enum',
    enum: TipType,
  })
  type: TipType;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
