import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import{Base} from 'src/base/entities/base.entity';
import { Item } from "src/item/entities/item.entity";

@Entity()
export class Inventory extends Base{
    @PrimaryGeneratedColumn()
    inv_id:number;

    @Column({nullable:false})
    quantity:number;

    //relations

    @ManyToOne(()=>Item)
    @JoinColumn({
    name:'item_id',
    referencedColumnName:'id',
    foreignKeyConstraintName:'fk_inv_item'
    })
    item:Item;
}