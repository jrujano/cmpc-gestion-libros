import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './models/customers.model';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

import { Op } from 'sequelize';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer)
    private readonly customerModel: typeof Customer,
  ) {}

  async create(createCustumerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerModel.create(createCustumerDto as any); // Solución temporal
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Customer[]; total: number }> {
    const offset = (page - 1) * limit;
    const where = search
      ? {
          [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }],
        }
      : {};

    const { rows, count } = await this.customerModel.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
    };
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerModel.findByPk(id, {});

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const book = await this.findOne(id);
    return book.update(updateCustomerDto);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await book.destroy();
  }
}
