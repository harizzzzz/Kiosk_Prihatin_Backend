import { Controller, Get, Post, Body, Patch, Param, Delete ,Request} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post('create')
  async createItem(@Body()CreateItemDto:CreateItemDto){
    return this.itemService.createItem(CreateItemDto)}
  

 @Post("edit/:id")
  async edit(
    @Body() updateItemDto: UpdateItemDto,
    @Param("id") id: number,
    
  ) {
    return this.itemService.modifyItem(updateItemDto, id);
  }
  }

