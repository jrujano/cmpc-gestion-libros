import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Editorial } from './models/editorial.model';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';
import { Op } from 'sequelize';
@Injectable()
export class EditorialsService {
  constructor(
    @InjectModel(Editorial)
    private readonly editorialModel: typeof Editorial,
  ) {}

  async create(createEditorialDto: CreateEditorialDto): Promise<Editorial> {
    return this.editorialModel.create({ ...createEditorialDto });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: Editorial[]; total: number }> {
    const offset = (page - 1) * limit;
    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await this.editorialModel.findAndCountAll({
      where,
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
    };
  }

  async findOne(id: number): Promise<Editorial> {
    return this.editorialModel.findByPk(id, {
      include: ['books'],
    });
  }

  async update(
    id: number,
    updateEditorialDto: UpdateEditorialDto,
  ): Promise<Editorial> {
    const editorial = await this.editorialModel.findByPk(id);
    return editorial.update(updateEditorialDto);
  }

  async remove(id: number): Promise<void> {
    const editorial = await this.editorialModel.findByPk(id);
    await editorial.destroy();
  }
}
