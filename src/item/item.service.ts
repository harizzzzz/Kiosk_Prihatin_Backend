import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InventoryService } from 'src/inventory/inventory.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
  ) {}

  async createItem(CreateItemDto: CreateItemDto) {
    try {
      const item = this.itemRepo.create({
        item_name: CreateItemDto.item_name,
        item_desc: CreateItemDto.item_desc,
        item_imgLink: CreateItemDto.item_imgLink,
      });
      const savedItem = await this.itemRepo.save(item);
      if (!savedItem) {
        throw new BadRequestException();
      }
      const { item_name, item_desc } = savedItem;
      return { item_name, item_desc };
    } catch (error) {
      console.log(error);
    }
  }

  async modifyItem(UpdateItemDto: UpdateItemDto, id: number) {
    try {
      const currentItem = await this.itemRepo.findOne({
        where: { id },
      });

      for (const key of Object.keys(UpdateItemDto)) {
        currentItem[key] = UpdateItemDto[key];
      }
      const newItem = await this.itemRepo.update(currentItem.id, currentItem);
      if (newItem) {
        return {
          statusCode: 200,
        };
      } else {
        return {
          statusCode: 400,
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteItem(id: number) {
    const item = this.findOneById(id);
    if (!item) {
      throw new BadRequestException();
    } else {
      const query = this.itemRepo
        .createQueryBuilder('item')
        .softDelete()
        .where('id=:id', { id: id });

      try {
        const res = query.execute();
        if (res) {
          return { statusCode: 200 };
        } else {
          return { statusCode: 400 };
        }
      } catch (e) {
        console.log(e);
        throw new BadRequestException();
      }
    }
  }

  async getItem(id: number) {
    try {
      const query = this.itemRepo
        .createQueryBuilder('item')
        .select([
          'item.id as id',
          'item.item_name as name',
          'item.item_desc as description',
          'item.item_imgLink as link',
        ])
        .where('id=:id', { id: id });

      try {
        const res = await query.getRawOne();
        if (res) {
          return res;
        } else {
          return null;
        }
      } catch (e) {
        console.log(e);
        throw new BadRequestException();
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findOneById(id: number) {
    try {
      const item = await this.itemRepo.findOneBy({ id });
      if (item) {
        return item;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  //worker functions

  async findOne(id: number) {
    try {
      const item = await this.itemRepo.findOne({
        where: { id },
      });
      if (!item) {
        throw new BadRequestException();
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOneItem(item_id: number) {
    try {
      if (!item_id) {
        return null;
      }
      const item = await this.itemRepo.findOne({
        where: { id: item_id },
      });
      if (item) {
        return item;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async save(item: Item) {
    try {
      await this.itemRepo.save(item);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
