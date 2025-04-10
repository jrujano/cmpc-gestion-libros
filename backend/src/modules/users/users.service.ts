import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize, // Inyección de Sequelize para transacciones
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const transaction = await this.sequelize.transaction();

    try {
      const existingUser = await this.userModel.findOne({
        where: { email: createUserDto.email },
        transaction, // Verificar existencia dentro de la transacción
      });

      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }

      const user = await this.userModel.create(createUserDto, { transaction });

      await transaction.commit(); // Confirmar la transacción
      return user;
    } catch (error) {
      await transaction.rollback(); // Revertir cambios si ocurre un error
      throw error; // Relanzar el error para manejarlo en el controlador
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userModel.findAll();
    return users.map((user) => this.mapToDto(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.mapToDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userModel.findByPk(id, { transaction });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userModel.findOne({
          where: {
            email: updateUserDto.email,
            id: { [Op.ne]: id },
          },
          transaction,
        });

        if (existingUser) {
          throw new ConflictException('El email ya está en uso');
        }
      }

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      await user.update(updateUserDto, { transaction });
      await transaction.commit(); // Confirmar la transacción
      return this.mapToDto(user);
    } catch (error) {
      await transaction.rollback(); // Revertir la transacción en caso de error
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userModel.findByPk(id, { transaction });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      await user.destroy({ transaction });
      await transaction.commit(); // Confirmar la transacción
    } catch (error) {
      await transaction.rollback(); // Revertir la transacción en caso de error
      throw error;
    }
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userModel.findByPk(id, { transaction });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      await user.update({ refreshToken }, { transaction });
      await transaction.commit(); // Confirmar la transacción
    } catch (error) {
      await transaction.rollback(); // Revertir la transacción en caso de error
      throw error;
    }
  }

  private mapToDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });
    return user?.get({ plain: true }); // Convierte a objeto plano si existe
  }
}
