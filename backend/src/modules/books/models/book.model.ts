import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  BelongsToMany,
  DefaultScope,
  Scopes,
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Author } from '../../authors/models/author.model';
import { Genre } from '../../genres/models/genre.model';
import { Editorial } from '../../editorials/models/editorial.model';
import { BookAuthor } from './book-author.model';
@DefaultScope(() => ({
  where: { deletedAt: null },
}))
@Scopes(() => ({
  withDeleted: { where: {} },
  deleted: { where: { deletedAt: { [Op.ne]: null } } },
}))
@Table({
  tableName: 'books',
  paranoid: true, // Habilita soft delete
})
export class Book extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING(200), allowNull: false })
  title: string;

  @Column({ type: DataType.STRING(20), unique: true })
  ISBN: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  stock: number;

  @Column({ type: DataType.DATE })
  publicationDate: Date;

  @ForeignKey(() => Genre)
  @Column({ type: DataType.INTEGER })
  genreId: number;

  @BelongsTo(() => Genre, {
    foreignKey: 'genreId',
    constraints: false, // Si hay problemas con las restricciones
  })
  genre: Genre;

  @ForeignKey(() => Editorial)
  @Column({ type: DataType.INTEGER })
  editorialId: number;

  @BelongsTo(() => Editorial, {
    foreignKey: 'editorialId',
    constraints: false,
  })
  editorial: Editorial;

  @Column({ type: DataType.STRING(255) })
  coverImage: string;

  @Column({ type: DataType.STRING(20) })
  edition: string;

  @Column({ type: DataType.INTEGER })
  pages: number;

  // Solo declaración sin @Column
  //Si realmente necesitas acceder a deletedAt desde tu código TypeScript, puedes declararlo así:

  declare deletedAt: Date;
  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[];
}
