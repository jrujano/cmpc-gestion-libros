import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Author } from './models/author.model';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(
    @InjectModel(Author)
    private readonly authorModel: typeof Author,
    private readonly sequelize: Sequelize, // Inyección de Sequelize para transacciones
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const transaction = await this.sequelize.transaction(); // Iniciar transacción

    try {
      this.logger.log('Creando nuevo autor', { name: createAuthorDto.name });
      const author = await this.authorModel.create(createAuthorDto, {
        transaction,
      }); // Crear autor dentro de la transacción
      await transaction.commit(); // Confirmar transacción
      return author;
    } catch (error) {
      await transaction.rollback(); // Revertir transacción en caso de error
      this.logger.error('Error al crear autor', error);
      throw error;
    }
  }

  async findAll(): Promise<Author[]> {
    return this.authorModel.findAll();
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorModel.findByPk(id, { include: ['books'] });
    if (!author) {
      throw new NotFoundException(`Autor con ID ${id} no encontrado`);
    }
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const transaction = await this.sequelize.transaction(); // Iniciar transacción

    try {
      const author = await this.authorModel.findByPk(id, { transaction }); // Buscar autor dentro de la transacción
      if (!author) {
        throw new NotFoundException(`Autor con ID ${id} no encontrado`);
      }

      await author.update(updateAuthorDto, { transaction }); // Actualizar dentro de la transacción
      await transaction.commit(); // Confirmar transacción
      this.logger.log(`Autor ID ${id} actualizado correctamente`);
      return author;
    } catch (error) {
      await transaction.rollback(); // Revertir transacción en caso de error
      this.logger.error(`Error al actualizar autor ID ${id}`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.sequelize.transaction(); // Iniciar transacción

    try {
      const author = await this.authorModel.findByPk(id, { transaction }); // Buscar autor dentro de la transacción
      if (!author) {
        throw new NotFoundException(`Autor con ID ${id} no encontrado`);
      }

      await author.destroy({ transaction }); // Eliminar autor dentro de la transacción
      await transaction.commit(); // Confirmar transacción
      this.logger.log(`Autor ID ${id} eliminado correctamente`);
    } catch (error) {
      await transaction.rollback(); // Revertir transacción en caso de error
      this.logger.error(`Error al eliminar autor ID ${id}`, error);
      throw error;
    }
  }
}
