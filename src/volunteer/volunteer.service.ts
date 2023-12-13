import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { EntityRepository, QueryBuilder, Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { VSessionService } from 'src/v_session/v_session.service';
import e from 'express';
import { error } from 'console';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer) private volRepo: Repository<Volunteer>,
    private usersService: UsersService,
    private vsessionService: VSessionService,
  ) {}

  async saveVolunteer(volDto: CreateVolunteerDto) {
    try {
      const user = await this.usersService.findOne(volDto.student_id);
      if (user != null) {
        const vsession = await this.vsessionService.findOne(volDto.session_id);
        const existing = await this.findSessionMatch(
          Number(volDto.student_id),
          Number(volDto.session_id),
        );
        if (existing) {
          return {
            message: 'User has already registered on this session!',
          };
        } else {
          const regCount = await this.findAllSessionbyId(
            Number(volDto.session_id),
          );
          const currentLimit = Number(vsession.VSession_limit) - regCount;
          if (currentLimit > 0) {
            const vol = this.volRepo.create({
              student: user,
              session: vsession,
            });
            const savedVol = await this.volRepo.save(vol);
            if (savedVol) {
              return { statusCode: 201 };
            }
          } else {
            return {
              message: 'Maximum limit reached!',
            };
          }
        }
      } else {
        return 'user does not exist';
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  //kuli(zul) function
  async findSessionMatch(student_id: number, id: number) {
    const query = this.volRepo
      .createQueryBuilder('volunteer')
      .select(['volunteer'])
      .where('student_id IN (:student_id)', { student_id: student_id })
      .andWhere('session_id IN (:session_id)', { session_id: id });
    try {
      const res = query.getExists();
      return res;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findAllSessionbyId(id: number) {
    const queryBuilder = this.volRepo
      .createQueryBuilder('volunteer')
      .leftJoinAndSelect('volunteer.student', 'users')
      .leftJoinAndSelect('volunteer.session', 'vsession')
      .select(['volunteer', 'users.full_name', 'vsession.VSession_name'])
      .where('volunteer.session_id IN (:session_id)', {
        session_id: id,
      });
    try {
      const res = await queryBuilder.getCount();
      return res;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }
}
