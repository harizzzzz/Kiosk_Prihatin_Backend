import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guard/local.guard';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDTO } from './dto';
import { AccessTokenGuard } from './guard/access-token.guard';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.signIn(login.username, login.password)
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Request() req: any) {
    return this.authService.logout(req.user)
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh')
  async refresh(@Request() req: any, @Body() rt: RefreshDTO) {
    return await this.authService.refresh(req.user, rt.refreshToken)
  }

  @UseGuards(AccessTokenGuard)
  @Get('protected')
  hi() {
    return 'hi'
  }


}
