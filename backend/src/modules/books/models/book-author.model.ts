import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Book } from './book.model';
import { Author } from '../../authors/models/author.model';
import { DataType } from 'sequelize-typescript';

@Table({
  tableName: 'book_authors',
  timestamps: false,
})
export class BookAuthor extends Model {
  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    field: 'book_id',
    primaryKey: true,
  })
  bookId: number;

  @ForeignKey(() => Author)
  @Column({
    type: DataType.INTEGER,
    field: 'author_id',
    primaryKey: true,
  })
  authorId: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'author_role',
  })
  authorRole: string; // Ej: "Principal", "Coautor", "Traductor"
}
