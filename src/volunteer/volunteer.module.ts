import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { Volunteer } from './entities/volunteer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { VSessionModule } from 'src/v_session/v_session.module';
import { Users } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Volunteer, Users]),
    UsersModule,
    VSessionModule,
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
