import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  improvement: string;

  @Column({ type: 'varchar' })
  feedback: string;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;
}
