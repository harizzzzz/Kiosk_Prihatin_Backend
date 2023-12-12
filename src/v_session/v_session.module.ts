import { Module } from '@nestjs/common';
import { VSessionService } from './v_session.service';
import { VSessionController } from './v_session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VSession } from './entities/v_session.entity';

@Module({
  imports:[TypeOrmModule.forFeature([VSession])],
  controllers: [VSessionController],
  providers: [VSessionService],
  exports:[VSessionService]
})
export class VSessionModule {}
