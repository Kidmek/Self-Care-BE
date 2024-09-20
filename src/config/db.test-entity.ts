import { Base } from '../common/base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DB_Test extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  improvement: string;

  @Column({ type: 'varchar' })
  feedback: string;
}
