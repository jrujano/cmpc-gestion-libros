import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Book } from '../../books/models/book.model';

@Table({
  tableName: 'editorials',
  timestamps: true,
  underscored: true,
})
export class Editorial extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'foundation_date',
  })
  foundationDate: Date;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  website: string;

  @HasMany(() => Book)
  books: Book[];
}
