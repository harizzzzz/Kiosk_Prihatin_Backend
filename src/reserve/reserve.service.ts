import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Reserve } from './entities/reserve.entity';
import { Repository } from 'typeorm';
import { ItemService } from 'src/item/item.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(Reserve)
    private reserveRepo: Repository<Reserve>,
    private itemService: ItemService,
    private inventoryService: InventoryService,
    private usersService: UsersService,

    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
  ) {}

  async createReservation(createDto: CreateReserveDto) {
    try {
      const user = await this.usersService.findOne(createDto.student_id);
      if (user) {
        const itemFind = await this.itemService.findOneItem(createDto.item_id);
        const reservation = await this.reserveRepo.create({
          student: user,
          item: itemFind,
          session_id: createDto.session_id,
          quantity: createDto.quantity,
        });
        const savedReserve = await this.reserveRepo.save(reservation);

        const oldInventory = await this.inventoryService.findOne(
          createDto.inv_id,
        );
        if (oldInventory != null) {
          const itemSearch = await this.itemService.findOneItem(
            createDto.item_id,
          );
          const newInventory = await this.inventoryRepo.create({
            item: itemSearch,
            quantity: oldInventory.quantity - createDto.quantity,
          });

          const savedNewInventory = await this.inventoryRepo.save(newInventory);
          if (savedNewInventory && savedReserve) {
            return { message: 'Inventory updated', statusCode: 201 };
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
