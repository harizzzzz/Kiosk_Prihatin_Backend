import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
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
import { VSession } from 'src/v_session/entities/v_session.entity';
import { RemoveVolunteerDto } from './dto/remove-volunteer.dto';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer) private volRepo: Repository<Volunteer>,
    private usersService: UsersService,
    private vsessionService: VSessionService,

    @InjectRepository(VSession) private vSessionRepo: Repository<VSession>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
  ) {}

  async saveVolunteer(volDto: CreateVolunteerDto) {
    try {
      const user = await this.usersService.findOne(volDto.student_id);
      if (user != null) {
        const vsession = await this.vsessionService.findOne(
          Number(volDto.session_id),
        );
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

  async getAll(id: number) {
    try {
      const student_id = id;
      console.log(student_id);
      const query = this.vSessionRepo
        .createQueryBuilder('VSession')
        .select([
          'VSession.id',
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

      const Vsessions = await query.getRawMany();

      const vsessionWithMatches = await Promise.all(
        Vsessions.map(async (vSession) => {
          const matchExists = await this.findSessionMatch(
            student_id,
            Number(vSession.VSession_id),
          );
          return { vSession, regStatus: matchExists };
        }),
      );

      return vsessionWithMatches;
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async getAllRegistered(id: number) {
    try {
      const student_id = id;
      console.log(student_id);
      const query = this.vSessionRepo
        .createQueryBuilder('VSession')
        .select([
          'VSession.id',
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
        })
        .andWhere('volunteer.student_id=:student_id', {
          student_id: student_id,
        });

      const count = await query.getCount();
      const Vsessions = await query.getRawMany();
      if (count != 0) {
        return Vsessions;
      } else {
        return { message: 'No data' };
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getAllforAdmin() {
    try {
      const query = this.vSessionRepo
        .createQueryBuilder('VSession')
        .select([
          'VSession.id as id',
          'VSession.VSession_name as name',
          'VSession.VSession_desc as description',
          "DATE_FORMAT(VSession.VSession_date, '%d %b %Y') as date",
          'VSession.VSession_limit as u_limit',
          'VSession.VSession_hour as duration',
        ])
        .where('VSession.VSession_date < :dateToday', {
          dateToday: new Date(),
        })
        .orderBy('date', 'ASC');

      const count = await query.getCount();
      const Vsessions = await query.getRawMany();

      const vsessionWithParticipants = await Promise.all(
        Vsessions.map(async (vSession) => {
          const part = await this.findParticipants(Number(vSession.id));
          return { vSession, participants: part };
        }),
      );

      return vsessionWithParticipants;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getAllUpcomingforAdmin() {
    try {
      const query = this.vSessionRepo
        .createQueryBuilder('VSession')
        .select([
          'VSession.id as id',
          'VSession.VSession_name as name',
          'VSession.VSession_desc as description',
          "DATE_FORMAT(VSession.VSession_date, '%d %b %Y') as date",
          'VSession.VSession_limit as u_limit',
          'VSession.VSession_hour as duration',
        ])
        .where('VSession.VSession_date >= :dateToday', {
          dateToday: new Date(),
        })
        .orderBy('date', 'DESC');

      const count = await query.getCount();
      const Vsessions = await query.getRawMany();

      const vsessionWithParticipants = await Promise.all(
        Vsessions.map(async (vSession) => {
          const part = await this.findParticipants(Number(vSession.id));
          return { vSession, participants: part };
        }),
      );

      return vsessionWithParticipants;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
  async getAllHistory(id: number) {
    try {
      const student_id = id;
      console.log(student_id);
      const query = this.volRepo
        .createQueryBuilder('volunteer')
        .select([
          'VSession.id',
          'VSession.VSession_name',
          'VSession.VSession_desc',
          "DATE_FORMAT(VSession_date, '%d %b %Y') as VSession_date",
          'VSession.VSession_limit',
          'VSession.VSession_hour',
        ])
        .leftJoin('volunteer.session', 'VSession')
        .leftJoin('volunteer.student', 'Users')
        .groupBy('volunteer.session_id')
        .where('VSession.VSession_date < :dateToday', {
          dateToday: new Date(),
        })
        .andWhere('volunteer.student_id=:student_id', {
          student_id: student_id,
        });

      const count = await query.getCount();
      const Vsessions = await query.getRawMany();

      const vsessionWithParticipants = await Promise.all(
        Vsessions.map(async (vSession) => {
          const part = await this.findParticipants(
            Number(vSession.VSession_id),
          );
          return { vSession, participants: part };
        }),
      );

      return vsessionWithParticipants;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteSession(session_id: number) {
    try {
      const query = this.volRepo
        .createQueryBuilder('volunteer')
        .delete()
        .where('volunteer.session_id=:session_id', { session_id: session_id });

      const res = await query.execute();
      if (res) {
        const nextQuery = this.vSessionRepo
          .createQueryBuilder('VSession')
          .softDelete()
          .where('id=:session_id', { session_id: session_id });

        const resNext = await nextQuery.execute();

        if (resNext) {
          return { statusCode: 201 };
        } else {
          throw new BadRequestException();
        }
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async removeRegistration(volDto: RemoveVolunteerDto) {
    try {
      const query = this.volRepo
        .createQueryBuilder()
        .delete()
        .from('volunteer')
        .where('student_id=:student_id', { student_id: volDto.student_id })
        .andWhere('session_id=:session_id', { session_id: volDto.session_id });

      try {
        const res = await query.execute();
        return res;
      } catch (error) {
        console.log(error);
        throw new BadRequestException();
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
      const [sql, parameters] = query.getQueryAndParameters();

      // Log the SQL query and parameters
      Logger.log(`SQL Query: ${sql}`);
      Logger.log(`Parameters: ${JSON.stringify(parameters)}`);
      const res = await query.getExists();
      return res;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findParticipants(id: number) {
    const query = this.userRepo
      .createQueryBuilder('users')
      .select(['GROUP_CONCAT(users.full_name) as names'])
      .leftJoin('users.volunteers', 'volunteer')
      .where('volunteer.session_id=:session_id', { session_id: id });

    try {
      const [sql, parameters] = query.getQueryAndParameters();

      // Log the SQL query and parameters
      Logger.log(`SQL Query: ${sql}`);
      Logger.log(`Parameters: ${JSON.stringify(parameters)}`);

      const res = await query.getRawOne();
      return res;
    } catch (e) {
      console.log(e);
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
