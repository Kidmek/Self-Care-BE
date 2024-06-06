import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tip } from './tip.entity';

@Entity()
export class Media {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  fileName: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'enum', enum: ['VIDEO', 'PICTURE'] })
  type: string;

  @ManyToOne(() => Tip, (tip) => tip.media, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tip: Tip;
}
