import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ModifyUserDto,SignupDTO } from './dto';
import { Repository } from "typeorm";
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepo:Repository<Users> )
    {}
  
  async signUp(signupDto:SignupDTO){
    try{
      const user=this.userRepo.create({
        full_name:signupDto.full_name,
        email:signupDto.email,
        student_id:signupDto.student_id,
        password_hash:signupDto.password,
      });
    const savedUser=await this.userRepo.save(user);
    if(!savedUser){
      throw new BadRequestException();
    } 
    const { full_name, email, student_id}=savedUser;
    return { full_name, email, student_id }
    }
      catch(error){
        console.log(error);
        throw new BadRequestException("Student ID or email is already taken!");
      }
    }

    async modifyUser(user: any, modifyUserDto: ModifyUserDto) {
      try {
        const currentUser: any = await this.userRepo.findOne({
          where: { id: user.id },
        });
        for (const key of Object.keys(modifyUserDto)) {
          if (key === "password_hash") {
            modifyUserDto[key] = await this.hashPassword(modifyUserDto[key]);
          }
          currentUser[key] = modifyUserDto[key];
        }
        const newUser = await this.userRepo.update(currentUser.id, currentUser);
        if (newUser) {
          return {
            statusCode: 200,
          };
        } else {
          return {
            statusCode: 400,
          };
        }
      } catch (err) {
        console.log('hihi');
        console.log(err);
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
      const updatedUser = await this.userRepo.update(user.id, user)
      if (!updatedUser) {
        throw new BadRequestException()
      }
      return updatedUser
    } catch (error) {
      console.log('hahaha')
      console.log(error)
    }
  }
  }

