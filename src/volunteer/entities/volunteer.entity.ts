import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Users } from 'src/users/entities/user.entity';
import { VSession } from 'src/v_session/entities/v_session.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;
  //relations
  @ManyToOne(() => Users, (users) => users.volunteers)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student: Users;

  @ManyToOne(() => VSession, (vsession) => vsession.volunteers)
  @JoinColumn({ name: 'session_id', referencedColumnName: 'id' })
  session: VSession;
}
