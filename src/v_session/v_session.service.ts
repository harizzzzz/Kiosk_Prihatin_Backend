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
import { VolunteerService } from 'src/volunteer/volunteer.service';
import { Volunteer } from 'src/volunteer/entities/volunteer.entity';
import { merge } from 'rxjs';

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
          'VSession.VSession_date as VSession_date',
          'VSession.VSession_limit',
          'VSession.VSession_hour',
          'COUNT(volunteer.session_id) AS volunteer_count',
        ])
        .leftJoin('VSession.volunteers', 'volunteer')
        .groupBy('VSession.id')
        .where('VSession.VSession_date >= :dateToday', {
          dateToday: new Date(),
        });
      console.log(await query.getMany());
      const Vsessions = await query.getRawMany();

      /*  const vsession = [];
      Vsessions.forEach((vSession) => {
        vsession.push({
          vSession,
        });
      });*/
      return Vsessions;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getAllNoException() {
    try {
      const query = this.vsessionrepo
        .createQueryBuilder('VSession')

        .select([
          'vSession.id',
          'VSession.VSession_name',
          'VSession.VSession_desc',
          'VSession.VSession_date as VSession_date',
          'VSession.VSession_limit',
          'VSession.VSession_hour',
          'COUNT(volunteer.session_id) AS volunteer_count',
        ])
        .leftJoin('VSession.volunteers', 'volunteer')
        .groupBy('VSession.id');
      console.log(await query.getMany());
      const Vsessions = await query.getRawMany();

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

  async findSession(id: number) {
    try {
      const session_id = id;
      const query = this.vsessionrepo
        .createQueryBuilder('vSession')
        .select([
          'VSession_name',
          'VSession_desc',
          "DATE_FORMAT(VSession_date, '%d %b %Y') as VSession_date",
        ])
        .where('id=:id', { id: session_id });
      try {
        const res = await query.getRawOne();

        return res;
      } catch (error) {
        console.log(error);
        throw new BadRequestException();
      }
    } catch (err) {
      throw new BadRequestException('Student does not exist !');
    }
  }

  //workers function

  async findRegistered(id: number) {
    try {
    } catch (err) {}
  }

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
