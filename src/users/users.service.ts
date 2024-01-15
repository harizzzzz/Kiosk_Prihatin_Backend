import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModifyUserDto, SignupDTO } from './dto';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import * as bcrypt from 'bcrypt';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepo: Repository<Users>,
  ) {}

  async signUp(signupDto: SignupDTO) {
    try {
      const user = this.userRepo.create({
        full_name: signupDto.full_name,
        email: signupDto.email,
        student_id: signupDto.student_id,
        password_hash: signupDto.password,
      });
      const savedUser = await this.userRepo.save(user);
      if (!savedUser) {
        throw new BadRequestException();
      }
      const { full_name, email, student_id } = savedUser;
      return { full_name, email, student_id };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Student ID or email is already taken!');
    }
  }

  async modifyUser(user: any, modifyUserDto: ModifyUserDto) {
    try {
      const currentUser: any = await this.userRepo.findOne({
        where: { id: user.id },
      });

      // Hash the old password from the DTO and compare it
      const pass = modifyUserDto.password_old;
      const hashedOldPassword = await this.hashPassword(pass);

      const passwordMatched = await bcrypt.compare(
        pass,
        currentUser.password_hash,
      );

      if (!passwordMatched) {
        return {
          statusCode: 401, // Unauthorized
          message: 'Old password does not match.',
        };
      } else {
        // If old password matches, update the user information
        for (const key of Object.keys(modifyUserDto)) {
          if (key === 'password_hash') {
            // Hash the new password if provided
            if (modifyUserDto[key]) {
              currentUser[key] = await this.hashPassword(modifyUserDto[key]);
            }
          } else if (key !== 'password_old') {
            // Update other fields excluding password_old
            currentUser[key] = modifyUserDto[key];
          }
        }

        const newUser = await this.userRepo.save(currentUser);

        if (newUser) {
          return {
            statusCode: 200,
          };
        } else {
          return {
            statusCode: 400,
          };
        }
      }
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      };
    }
  }

  async deleteUser(deleteuserDto: DeleteUserDto) {
    try {
      const admin = await this.findOneAdmin(deleteuserDto.admin_id);
      if (!admin) {
        throw new BadRequestException();
      } else {
        const user = await this.findOne(deleteuserDto.user_id);
        if (!user) {
          throw new BadRequestException();
        } else {
          const query = this.userRepo
            .createQueryBuilder('users')
            .softDelete()
            .where('student_id=:student_id', {
              student_id: deleteuserDto.user_id,
            });

          const res = await query.execute();

          return res;
        }
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getAllStudent() {
    try {
      const query = this.userRepo
        .createQueryBuilder('users')
        .select([
          'users.id as id',
          'users.student_id as student_id',
          'users.full_name as name',
        ])
        .where('users.role=1');

      const res = await query.getRawMany();
      return res;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async findUser(username: string) {
    try {
      const student_id = username;
      const query = this.userRepo
        .createQueryBuilder('users')
        .select(['users.student_id', 'users.full_name', 'users.email'])
        .where('users.student_id = :student_id', { student_id: student_id });
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

  async getCount() {
    try {
      const query = this.userRepo
        .createQueryBuilder('users')
        .select('users.student_id')
        .where('users.role=1');
      try {
        const res = await query.getCount();
        return res;
      } catch (e) {
        console.log(e);
        throw new BadRequestException();
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }
  //worker function
  async hashPassword(password: any) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async findOne(username: string) {
    try {
      if (!username) {
        return null;
      }
      const user = await this.userRepo.findOne({
        where: { student_id: username },
      });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findOneUser(username: string) {
    try {
      if (!username) {
        return null;
      }
      const user = await this.userRepo.findOne({
        where: { student_id: username, role: 1 },
      });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findOneAdmin(username: string) {
    try {
      if (!username) {
        return null;
      }
      const user = await this.userRepo.findOne({
        where: { student_id: username, role: 2 },
      });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async findOneById(id: number) {
    try {
      const user = await this.userRepo.findOneBy({ id });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async save(user: Users) {
    try {
      await this.userRepo.save(user);
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async update(user: Users) {
    try {
      const updatedUser = await this.userRepo.update(user.id, user);
      if (!updatedUser) {
        throw new BadRequestException();
      }
      return updatedUser;
    } catch (error) {
      console.log('hahaha');
      console.log(error);
    }
  }
}
