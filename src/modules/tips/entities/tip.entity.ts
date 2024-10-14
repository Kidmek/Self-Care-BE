import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from './media.entity';
import { Base } from 'src/common/base';

export enum TipType {
  SLEEPING = 'sleeping',
  BREATHING = 'breathing',
  MUSCLE = 'muscle',
  GROUNDING = 'grounding',
}

@Entity()
export class Tip extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  description: string;

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
}
