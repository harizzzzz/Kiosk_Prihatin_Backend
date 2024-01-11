import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { ItemService } from 'src/item/item.service';
import { Item } from 'src/item/entities/item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
    private itemService: ItemService,

    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    try {
      const itemexist = await this.itemService.findOneItem(
        createInventoryDto.item_id,
      );
      if (itemexist != null) {
        const inventory = this.inventoryRepo.create({
          quantity: createInventoryDto.quantity,
          item: itemexist,
        });

        const savedItem = await this.inventoryRepo.save(inventory);
        if (savedItem) {
          return { statusCode: 201 };
        }
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async retrieveAllMostRecent() {
    try {
      const querylimit = await this.itemRepo
        .createQueryBuilder('item')
        .select('item.*');

      const limited = await querylimit.getCount();

      const query = this.inventoryRepo
        .createQueryBuilder('inventory')
        .select([
          'inventory.inv_id as id',
          'inventory.item_id as item_id',
          'inventory.quantity as quantity',
          'inventory.createdDate as updatedAt',
          'ROW_NUMBER() OVER (PARTITION BY inventory.item_id ORDER BY inventory.createdDate DESC) as RowNum',
          'item.item_name as name',
          'item.item_desc as description',
          'item.item_imgLink as Link',
        ])
        .leftJoin('inventory.item', 'item')
        .orderBy('5')
        .limit(limited);

      const recentInventory = await query.getRawMany();

      return recentInventory;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  //worker fx
  async findOne(inv_id: number) {
    try {
      if (!inv_id) {
        return null;
      }
      const inventory = await this.inventoryRepo.findOne({
        where: { inv_id: inv_id },
      });
      if (inventory) {
        return inventory;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
