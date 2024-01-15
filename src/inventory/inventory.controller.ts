import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CreateItemDto } from 'src/item/dto/create-item.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('add')
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return await this.inventoryService.create(createInventoryDto);
  }

  @Post('create')
  async add(@Body() createDto: CreateItemDto) {
    return await this.inventoryService.createInventoryandItem(createDto);
  }

  @Get('getAll')
  async getAllRecentInventory() {
    return this.inventoryService.retrieveAllMostRecent();
  }

  @Get('getInventoryByItem/:item_id')
  async getInventoryByItem(@Param('item_id') item_id: number) {
    return this.inventoryService.getInventoryByItem(item_id);
  }

  @Get('getItemMostRecent/:item_id')
  async retrieveItemMostRecentInventory(@Param('item_id') item_id: number) {
    return this.inventoryService.retrieveItemMostRecentInventory(item_id);
  }
}
