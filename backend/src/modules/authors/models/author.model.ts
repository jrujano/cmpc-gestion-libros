import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Book } from '../../books/models/book.model';
import { BookAuthor } from '../../books/models/book-author.model';
import { CreateAuthorDto } from '../dto/create-author.dto';

@Table({
  tableName: 'authors',
  timestamps: true,
  underscored: true,
})
export class Author extends Model<Author, CreateAuthorDto> {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  biography: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  nationality: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'birth_date',
  })
  birthDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'death_date',
  })
  deathDate: Date;

  @BelongsToMany(() => Book, () => BookAuthor)
  books: Book[];
}
