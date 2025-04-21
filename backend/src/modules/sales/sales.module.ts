import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './models/sales.model';
import { SaleItem } from './models/sale-item.model';    
import { DatabaseModule } from '../shared/database/database.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [SequelizeModule.forFeature([Sale, SaleItem]),  InventoryModule,
      DatabaseModule,],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}