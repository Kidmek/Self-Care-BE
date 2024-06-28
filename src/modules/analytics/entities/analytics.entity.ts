import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AnalyticField {
  SLEEPING = 'sleeping',
  BREATHING = 'breathing',
  MUSCLE = 'muscle',
  GROUNDING = 'grounding',
  JOURNAL = 'journaling',
  WHEEL = 'wheel',
  TRACKING = 'tracking',
  REMINDER = 'reminder',
  REMINDER_YES = 'reminder_yes',
  REMINDER_NO = 'reminder_no',
}

@Entity()
export class Analytic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AnalyticField, unique: true })
  name: AnalyticField;

  @Column({ type: 'bigint', unique: true })
  amount: number = 0;
}
