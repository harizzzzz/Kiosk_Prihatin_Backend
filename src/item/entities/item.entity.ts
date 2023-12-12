import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import{Base} from 'src/base/entities/base.entity';
import { Reserve } from 'src/reserve/entities/reserve.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
@Entity()
export class Item extends Base{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    item_name:string;

    @Column()
    item_desc:string;

    //relationss

    @OneToMany(()=>Reserve,reserve=>reserve.reserve_id)
    reserve:Reserve[];

    @OneToMany(()=>Inventory,inventory=>inventory.inv_id)
    inventory:Inventory[];


}
