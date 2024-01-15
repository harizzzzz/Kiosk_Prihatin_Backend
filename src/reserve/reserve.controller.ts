import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';

@Controller('reserve')
export class ReserveController {
  constructor(private reserveService: ReserveService) {}

  @Post('add')
  async create(@Body() createReserveDto: CreateReserveDto) {
    return await this.reserveService.createReservation(createReserveDto);
  }

  @Get('getOneSession/:session_id')
  async getOneSession(@Param('session_id') session_id: string) {
    return await this.reserveService.getOneSession(session_id);
  }

  @Get('sessionExist/:session_id')
  async getExisted(@Param('session_id') session_id: string) {
    return await this.reserveService.getSessionExist(session_id);
  }

  @Get('reserveHistory/:student_id')
  async getReserveHistory(@Param('student_id') student_id: string) {
    return await this.reserveService.retrieveHistory(student_id);
  }

  @Get('getReserveByItem/:item_id')
  async getReserveByItem(@Param('item_id') item_id: number) {
    return await this.reserveService.getReservationByItem(item_id);
  }

  @Get('getTotalReservedByItem/:item_id')
  async getTotalReservedByItem(@Param('item_id') item_id: number) {
    return await this.reserveService.getTotalReservedByItem(item_id);
  }
}
