import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Book } from '../../books/models/book.model';

@Table({
  tableName: 'genres',
  timestamps: true,
  underscored: true,
})
export class Genre extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @HasMany(() => Book)
  books: Book[];
}
