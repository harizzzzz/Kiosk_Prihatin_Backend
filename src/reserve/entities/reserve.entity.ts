import {Entity,Column,PrimaryGeneratedColumn,CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm'
import {Base} from 'src/base/entities/base.entity';
import { Users } from 'src/users/entities/user.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity()
export class Reserve extends Base{
    @PrimaryGeneratedColumn()
    reserve_id:number;

    @CreateDateColumn({type:'timestamp'})
    reserve_time:Date;

    //relations

    @ManyToOne(()=>Users)
    @JoinColumn({
        name:"student_id",
        referencedColumnName:'student_id',
        foreignKeyConstraintName:'fk_reserve_users'
    })
    student_id:Users;

    @ManyToOne(()=>Item,item=>item.id)
    items:Item;





}
