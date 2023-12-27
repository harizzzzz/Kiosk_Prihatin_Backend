import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ModifyUserDto } from './dto/modify-user.dto';
import { SignupDTO } from './dto';
import { Users } from './entities/user.entity';
import { AccessTokenGuard } from 'src/auth/guard/access-token.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return this.usersService.signUp(signupDTO);
  }

  @UseGuards(AccessTokenGuard)
  @Post('modify')
  async modifyUser(@Body() modifyUserDto: ModifyUserDto, @Request() req: any) {
    return this.usersService.modifyUser(req.user, modifyUserDto);
  }

  @Get('findOne/:username')
  async findUser(@Param('username') username: string) {
    return this.usersService.findUser(username);
  }
}
