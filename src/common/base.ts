import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class Base {
  @Exclude()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Exclude()
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  public updatedAt: Date;
}
