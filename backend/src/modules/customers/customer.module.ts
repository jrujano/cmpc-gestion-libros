import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './models/customers.model';
import { DatabaseModule } from '../shared/database/database.module';

@Module({
  imports: [SequelizeModule.forFeature([Customer]), DatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
