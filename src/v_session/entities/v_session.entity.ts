import { Base } from 'src/base/entities/base.entity';
import { Users } from 'src/users/entities/user.entity';
import { Volunteer } from 'src/volunteer/entities/volunteer.entity';
import {
  Entity,
  Column,
  BeforeInsert,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  Timestamp,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
@Entity()
export class VSession extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  VSession_name: string;

  @Column()
  VSession_desc: string;

  @Column({ nullable: false })
  VSession_limit: number;

  @Column()
  VSession_date: Date;

  @Column({ default: 1 })
  VSession_hour: number;

  //relation

  @OneToMany(() => Volunteer, (volunteer) => volunteer.session)
  volunteers: Volunteer[];
}
