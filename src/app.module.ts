import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BaseModule } from './base/base.module';
import { DonationModule } from './donation/donation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/entities/user.entity';
import { VSessionModule } from './v_session/v_session.module';
import { ReserveModule } from './reserve/reserve.module';
import { ItemModule } from './item/item.module';
import { InventoryModule } from './inventory/inventory.module';
import { VSession } from './v_session/entities/v_session.entity';
import { Reserve } from './reserve/entities/reserve.entity';
import { Item } from './item/entities/item.entity';
import { Inventory } from './inventory/entities/inventory.entity';
import { Donation } from './donation/entities/donation.entity';
import { Auth } from './auth/database/auth.entity';
import { AuthModule } from './auth/auth.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { Volunteer } from './volunteer/entities/volunteer.entity';

@Module({
  imports: [
    UsersModule,
    DonationModule,
    BaseModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'kioskprihatin',
      entities: [
        Users,
        VSession,
        Reserve,
        Item,
        Inventory,
        Donation,
        Auth,
        Volunteer,
      ],
      synchronize: true,
    }),
    VSessionModule,
    ReserveModule,
    ItemModule,
    InventoryModule,
    AuthModule,
    VolunteerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
