import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVSessionDto } from './dto/create-v_session.dto';
import { UpdateVSessionDto } from './dto/update-v_session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VSession } from './entities/v_session.entity';
import { Repository } from 'typeorm';
import { addVSessionDto } from './dto/add-vsession';

@Injectable()
export class VSessionService {
  constructor(
    @InjectRepository(VSession)
    private vsessionrepo: Repository<VSession>,
  ) {}

  async saveVSession(vsessionDto: addVSessionDto) {
    try {
      const vsession = this.vsessionrepo.create({
        VSession_name: vsessionDto.VSession_name,
        VSession_desc: vsessionDto.VSession_desc,
        VSession_limit: Number(vsessionDto.VSession_limit),
        VSession_date: vsessionDto.VSession_date,
        VSession_hour: Number(vsessionDto.VSession_hour),
      });

      const savedVsession = await this.vsessionrepo.save(vsession);
      return {
        status_code: 201,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async getAll() {
    try {
      const query = this.vsessionrepo
        .createQueryBuilder('VSession')
        .select([
          'VSession.VSession_name',
          'VSession.VSession_desc',
          'VSession.VSession_date',
          'VSession.VSession_limit',
          'VSession.VSession_hour',
        ])
        .where('VSession.VSession_name >= :dateToday', {
          dateToday: new Date(),
        });

      const Vsessions = await query.getMany();

      const vsession = [];
      Vsessions.forEach((vSession) => {
        vsession.push({
          vSession,
        });
      });
      return vsession;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  //workers function

  async findOne(username: string) {
    try {
      if (!username) {
        return null;
      }
      const session = await this.vsessionrepo.findOne({
        where: { id: Number(username) },
      });
      if (session) {
        return session;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
