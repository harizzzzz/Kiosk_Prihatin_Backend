import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VSessionService } from './v_session.service';
import { CreateVSessionDto } from './dto/create-v_session.dto';
import { UpdateVSessionDto } from './dto/update-v_session.dto';
import { addVSessionDto } from './dto/add-vsession';
import { retry } from 'rxjs';

@Controller('v-session')
export class VSessionController {
  constructor(private vsessionService: VSessionService) {}

  @Post('add')
  async addCar(@Body() vsessionDto: addVSessionDto) {
    return await this.vsessionService.saveVSession(vsessionDto);
  }

  @Get('findSession/:id')
  async findSession(@Param('id') id: number) {
    return await this.vsessionService.findSession(id);
  }

  @Get('getAll')
  async getAllSessions() {
    return this.vsessionService.getAll();
  }

  @Get('getAllNoException')
  async getAll() {
    return this.vsessionService.getAllNoException();
  }
}
