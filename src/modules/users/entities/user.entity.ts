import { Exclude } from 'class-transformer';
import { Feedback } from 'src/modules/feedbacks/entities/feedback.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}
export enum Gender {
  M = 'Male',
  F = 'Female',
  A = 'Admin',
}
@Entity('users')
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  firstName: string;

  @Column({ type: 'varchar', length: 20 })
  lastName: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ default: false })
  isActive: boolean;

  @Exclude()
  @Column({ type: 'int', nullable: true })
  otp: number;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  otpSentAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @Exclude()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
