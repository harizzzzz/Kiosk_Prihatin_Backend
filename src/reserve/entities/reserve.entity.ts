import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Base } from 'src/base/entities/base.entity';
import { Users } from 'src/users/entities/user.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity()
export class Reserve extends Base {
  @PrimaryGeneratedColumn()
  reserve_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  reserve_time: Date;

  @Column()
  session_id: string;

  @Column()
  quantity: number;

  //relations

  @ManyToOne(() => Users, (users) => users.reserve)
  @JoinColumn({
    name: 'student_id',
    referencedColumnName: 'student_id',
    foreignKeyConstraintName: 'fk_reserve_users',
  })
  student: Users;

  @ManyToOne(() => Item, (item) => item.reserve)
  @JoinColumn({
    name: 'item_id',
    referencedColumnName: 'id',
  })
  item: Item;
}
