import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Inventory } from './models/inventory.model';
import { Book } from '../books/models/book.model';

@Module({
  imports: [SequelizeModule.forFeature([Inventory, Book])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [SequelizeModule, InventoryService],
})
export class InventoryModule {}
