import { CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Base {
  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedDate: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deleteDate: Date

}
