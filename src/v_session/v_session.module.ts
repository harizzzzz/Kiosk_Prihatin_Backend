import { Module } from '@nestjs/common';
import { VSessionService } from './v_session.service';
import { VSessionController } from './v_session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VSession } from './entities/v_session.entity';
import { Volunteer } from 'src/volunteer/entities/volunteer.entity';
import { VolunteerModule } from 'src/volunteer/volunteer.module';

@Module({
  imports: [TypeOrmModule.forFeature([VSession, Volunteer])],
  controllers: [VSessionController],
  providers: [VSessionService],
  exports: [VSessionService],
})
export class VSessionModule {}
