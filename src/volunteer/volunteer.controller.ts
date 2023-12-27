import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';

@Controller('volunteer')
export class VolunteerController {
  constructor(private volunteerService: VolunteerService) {}

  @Post('add')
  async saveVol(@Body() volDto: CreateVolunteerDto) {
    return await this.volunteerService.saveVolunteer(volDto);
  }

  @Get('getAll/:id')
  async getAllVolunteer(@Param('id') id: number) {
    return await this.volunteerService.getAll(id);
  }
}
