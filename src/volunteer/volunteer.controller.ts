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
import { RemoveVolunteerDto } from './dto/remove-volunteer.dto';

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
  @Get('getAllRegistered/:id')
  async getAllRegistered(@Param('id') id: number) {
    return await this.volunteerService.getAllRegistered(id);
  }
  @Get('getAllHistory/:id')
  async getAllHistory(@Param('id') id: number) {
    return await this.volunteerService.getAllHistory(id);
  }

  @Post('cancelRegistration')
  async cancelReg(@Body() volDto: RemoveVolunteerDto) {
    return await this.volunteerService.removeRegistration(volDto);
  }
}
