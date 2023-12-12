import { Injectable ,BadRequestException} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
  constructor(    @InjectRepository(Item)
    private itemRepo:Repository<Item> )    {}


    async createItem(CreateItemDto:CreateItemDto){
      try{
        const item=this.itemRepo.create(
          {
            item_name:CreateItemDto.item_name,
            item_desc:CreateItemDto.item_desc
          }
        );
        const savedItem=await this.itemRepo.save(item);
    if(!savedItem){
      throw new BadRequestException();
    } 
    const { item_name, item_desc}=savedItem;
    return { item_name, item_desc }
      }catch(error){
        console.log(error);
      }
    }   
    
    async modifyItem(UpdateItemDto: UpdateItemDto,id:number) {
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

    async save(item: Item) {
      try {
        await this.itemRepo.save(item);
      } catch (error) {
        console.log(error);
        throw new BadRequestException();
      }
    }
  

 


}
