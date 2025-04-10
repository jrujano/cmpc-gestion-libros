import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Inventory } from './models/inventory.model';
import { NotFoundException } from '@nestjs/common';

import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryFilterDto } from './dto/inventory-filter.dto';
import { FindOptions, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Book } from '../books/models/book.model';
import { InventoryReportDto } from './dto/inventory-report.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory)
    private readonly inventoryModel: typeof Inventory,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryModel.create(createInventoryDto as any);
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.findOne(id);
    return inventory.update(updateInventoryDto);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await book.destroy();
  }

  async findAll(filter?: InventoryFilterDto): Promise<Inventory[]> {
    const where: any = {};

    if (filter?.bookId) {
      where.book_id = filter.bookId;
    }

    if (filter?.type) {
      where.tipo = filter.type;
    }

    if (filter?.startDate && filter?.endDate) {
      where.fecha_movimiento = {
        [Op.between]: [new Date(filter.startDate), new Date(filter.endDate)],
      };
    }

    return this.inventoryModel.findAll(where);
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryModel.findByPk(id, {
      include: ['book'],
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory;
  }

  async getInventoryReport(
    filter?: InventoryFilterDto,
  ): Promise<InventoryReportDto> {
    const where: any = {};

    if (filter?.bookId) {
      where.book_id = filter.bookId;
    }

    if (filter?.type) {
      where.type = filter.type;
    }

    if (filter?.startDate && filter?.endDate) {
      where.fecha_movimiento = {
        [Op.between]: [new Date(filter.startDate), new Date(filter.endDate)],
      };
    }

    const options: FindOptions<Inventory> = {
      where,
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'isbn'],
          required: false,
        },
      ],
      order: [['fecha_movimiento', filter?.order || 'DESC']],
    };

    const items = await this.inventoryModel.findAll(options);
    const total = await this.inventoryModel.count({ where });

    return {
      items,
      total,
    };
  }
}
