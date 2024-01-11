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
}
