import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Book } from '../../books/models/book.model';

@Table({
  tableName: 'inventory',
  timestamps: false,
  underscored: true,
})
export class Inventory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_movement',
  })
  idMovement: number;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    field: 'book_id',
    allowNull: true,
  })
  bookId: number;

  @Column({
    type: DataType.DATE,
    field: 'fecha_movimiento',
    defaultValue: DataType.NOW,
  })
  movementDate: Date;

  // @Column({
  //   type: DataType.INTEGER,
  //   field: 'movement_date',
  //   allowNull: false,
  // })
  // movementDay: number; // Asumo que es un campo numérico basado en tu 

  @Column({
    type: DataType.STRING(10),
    field: 'tipo',
    allowNull: true,
  })
  type: string;

  
  @Column({
    type: DataType.STRING(200),
    field: 'reason',
    allowNull: true,
  })
  reason: string;

  @Column({
    type: DataType.STRING(100),
    field: 'responsible_user',
    allowNull: true,
  })
  responsibleUser: string;

  @Column({
    type: DataType.INTEGER,
    field: 'amount',
    allowNull: false,
  })
  amount: number;


  

  @BelongsTo(() => Book)
  book: Book;
}
