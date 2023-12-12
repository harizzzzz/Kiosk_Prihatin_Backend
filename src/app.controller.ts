import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('bye')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hi')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHi(): string {
    return "Zul say hi";
  }
  
}
