import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleStatus } from './models/sales.model';
import { SaleItem } from './models/sale-item.model';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSaleItemDto } from './dto/create-sale-item.dto';
import { Sequelize } from 'sequelize-typescript';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryMovementType } from '../inventory/interfaces/inventory.interface';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale) private saleModel: typeof Sale,
    @InjectModel(SaleItem) private saleItemModel: typeof SaleItem,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
    private readonly inventoryService:InventoryService
  ) {}

  async create(createSaleDto: CreateSaleDto, transaction?: Transaction): Promise<Sale> {
    const sale = await this.saleModel.create({
      total: createSaleDto.total,
      customerId: createSaleDto.customerId,
      status: createSaleDto.status || 'pendiente',
    }, { transaction });

    const items = await this.saleItemModel.bulkCreate(
      createSaleDto.items.map(item => ({
        saleId: sale.id,
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      { transaction },
    );

    return { ...sale.toJSON(), items } as Sale;
  }

  async findAll(): Promise<Sale[]> {
    return this.saleModel.findAll({ include: [SaleItem] });
  }

  async findOne(id: number): Promise<Sale> {
    return this.saleModel.findByPk(id, { include: [SaleItem] });
  }

  async update(
    id: number,
    updateSaleDto: UpdateSaleDto & { items?: CreateSaleItemDto[] },
    transaction?: Transaction
  ): Promise<Sale> {
    const existingTransaction = !!transaction;
    transaction = transaction || await this.sequelize.transaction();
  
    try {
      // 1. Update sale header
      const sale = await this.saleModel.findByPk(id, {
        include: [SaleItem],
        transaction
      });
  
      if (!sale) {
        throw new NotFoundException('Sale not found');
      }
  
      await sale.update({
        total: updateSaleDto.total,
        customerId: updateSaleDto.customerId,
        status: updateSaleDto.status,
      }, { transaction });
  
      // 2. Handle items if provided
      if (updateSaleDto.items) {
        // Delete existing items
        await this.saleItemModel.destroy({
          where: { saleId: id },
          transaction
        });
  
        // Create new items
        await this.saleItemModel.bulkCreate(
          updateSaleDto.items.map(item => ({
            saleId: id,
            bookId: item.bookId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          { transaction }
        );
  
        // 3. Handle inventory adjustments if sale is completed
        if (sale.status === SaleStatus.COMPLETED) {
          await this.adjustInventoryForSaleUpdate(sale, updateSaleDto.items, transaction);
        }
      }
  
      if (!existingTransaction) {
        await transaction.commit();
      }
  
      return this.saleModel.findByPk(id, {
        include: [SaleItem],
        transaction
      });
    } catch (error) {
      if (!existingTransaction && transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }
  
  private async adjustInventoryForSaleUpdate(
    sale: Sale,
    newItems: CreateSaleItemDto[],
    transaction: Transaction
  ) {
    // 1. Reverse old inventory entries (add back removed quantities)
    for (const oldItem of sale.items) {
      await this.inventoryService.create({
        bookId: oldItem.bookId,
        type: InventoryMovementType.ENTRY,
        amount: oldItem.quantity,
        reason: 'Sale item removal',
      }, { transaction });
    }
  
    // 2. Process new inventory entries (deduct new quantities)
    for (const newItem of newItems) {
      await this.inventoryService.create({
        bookId: newItem.bookId,
        type: InventoryMovementType.EXIT,
        amount: newItem.quantity,
        reason: 'Sale item addition',
      }, { transaction });
    }
  }

  async remove(id: number): Promise<void> {
    const sale = await this.saleModel.findByPk(id);
    if (!sale) {
      throw new Error('Sale not found');
    }

    await sale.destroy();
  }

  
  async completeSale(id: number): Promise<Sale> {
    const transaction = await this.saleModel.sequelize.transaction();
    
    try {
      const sale = await this.saleModel.findByPk(id, {
        include: [SaleItem],
        transaction,
      });
  
      if (!sale) {
        throw new Error('Sale not found');
      }
  
      if (sale.status === 'completada') {
        throw new Error('Sale already completed');
      }
  
      // Update inventory for each item
      for (const item of sale.items) {
        // Here you would call your inventory service
        // to decrease stock for each book
        // await this.inventoryService.create({
        //   bookId: item.bookId,
        //   type: 'EXIT',
        //   amount: item.quantity,
        //   reason: 'Sale completion',
        // }, transaction);
      }
  
      await sale.update({ status: 'completed' }, { transaction });
      await transaction.commit();
      return sale;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}