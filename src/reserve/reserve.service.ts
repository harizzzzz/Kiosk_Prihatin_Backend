import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Reserve } from './entities/reserve.entity';
import { Repository } from 'typeorm';
import { ItemService } from 'src/item/item.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(Reserve)
    private reserveRepo: Repository<Reserve>,
    private itemService: ItemService,
    private inventoryService: InventoryService,
    private usersService: UsersService,

    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
  ) {}

  async createReservation(createDto: CreateReserveDto) {
    try {
      const user = await this.usersService.findOne(createDto.student_id);
      if (user) {
        const itemFind = await this.itemService.findOneItem(createDto.item_id);
        const reservation = await this.reserveRepo.create({
          student: user,
          item: itemFind,
          session_id: createDto.session_id,
          quantity: createDto.quantity,
        });
        const savedReserve = await this.reserveRepo.save(reservation);

        const oldInventory = await this.inventoryService.findOne(
          createDto.inv_id,
        );
        if (oldInventory != null) {
          const itemSearch = await this.itemService.findOneItem(
            createDto.item_id,
          );
          const newInventory = await this.inventoryRepo.create({
            item: itemSearch,
            quantity: oldInventory.quantity - createDto.quantity,
          });

          const savedNewInventory = await this.inventoryRepo.save(newInventory);
          if (savedNewInventory && savedReserve) {
            return { message: 'Inventory updated', statusCode: 201 };
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException();
    }
  }

  async retrieveHistory(student_id: string) {
    try {
      const sId = student_id;
      const distinctReserveQuery = await this.reserveRepo
        .createQueryBuilder('reserve')
        .select('distinct(reserve.session_id)')
        .where('reserve.student_id =:student_id', {
          student_id: sId,
        });

      const distinctReserveCount = await distinctReserveQuery.getCount();

      const query = this.reserveRepo
        .createQueryBuilder('reserve')
        .select([
          'reserve.reserve_id as reserve_id',
          'reserve.session_id as session_id',
          `DATE_FORMAT(reserve.reserve_time, '%d/%m/%Y, %h:%i %p') AS reserve_time`,
          'ROW_NUMBER() OVER (PARTITION BY reserve.session_id ORDER BY reserve.reserve_time) AS RowNum',
        ])
        .orderBy('4')
        .limit(distinctReserveCount);

      const reserveHistory = await query.getRawMany();

      return reserveHistory;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getReservationByItem(item_id: number) {
    try {
      const item = await this.itemService.findOneById(item_id);
      if (item) {
        const query = this.reserveRepo
          .createQueryBuilder('reserve')
          .select([
            'reserve.reserve_id as id',
            'reserve.quantity as quantity',
            'reserve.student_id as student_id',
            'reserve.session_id as session_id',
            `DATE_FORMAT(reserve.reserve_time, '%d/%m/%Y, %h:%i %p') AS reserve_time`,
          ])
          .orderBy('5', 'DESC')
          .where('item_id=:item_id', { item_id: item_id });

        const res = await query.getRawMany();
        return res;
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getTotalReservedByItem(item_id) {
    try {
      const query = this.reserveRepo
        .createQueryBuilder('reserve')
        .select([
          'item.id as id',
          'COALESCE(SUM(reserve.quantity), 0) AS total_quantity',
        ])
        .leftJoin('reserve.item', 'item')
        .where('item.id=:item_id', { item_id: item_id })
        .groupBy('item.id');

      const res = query.getRawOne();
      if (res) {
        return res;
      } else {
        throw new BadRequestException();
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getOneSession(session_id: string) {
    try {
      const sesh = await this.getSessionExist(session_id);
      if (sesh) {
        const query = this.reserveRepo
          .createQueryBuilder('reserve')
          .select([
            'reserve.reserve_id as reserve_id',
            'reserve.student_id as student_id',
            'users.full_name as student_name',
            'reserve.item_id as item_id',
            'item.item_name as item_name',
            'reserve.quantity as item_quantity',
            'reserve.reserve_time as time_created',
          ])
          .leftJoin('reserve.student', 'users')
          .leftJoin('reserve.item', 'item')
          .where('reserve.session_id IN (:session_id)', {
            session_id: session_id,
          });
        try {
          const [sql, parameters] = query.getQueryAndParameters();

          // Log the SQL query and parameters
          Logger.log(`SQL Query: ${sql}`);
          Logger.log(`Parameters: ${JSON.stringify(parameters)}`);
          const oneSession = await query.getRawMany();
          return oneSession;
        } catch (err) {
          console.log(err);
          throw new BadRequestException();
        }
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getSessionExist(session_id: string) {
    try {
      const query = this.reserveRepo
        .createQueryBuilder('reserve')
        .select(['reserve.reserve_id'])
        .where('reserve.session_id=:session_id', { session_id: session_id });
      try {
        const res = await query.getExists();

        if (res) {
          return res;
        } else {
          return { message: 'session does not exist !' };
        }
      } catch (e) {
        console.log(e);
        throw new BadRequestException();
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
