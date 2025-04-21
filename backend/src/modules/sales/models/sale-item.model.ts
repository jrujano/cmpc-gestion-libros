
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sale } from './sales.model';

@Table({ tableName: 'sale_detail', timestamps: false })
export class SaleItem extends Model {
  @Column({
    field: 'id_detail',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @ForeignKey(() => Sale)
  @Column({
    field: 'sale_id',
    type: DataType.INTEGER,
  })
  saleId: number;

  @BelongsTo(() => Sale)
  sale: Sale;

  @Column({
    field: 'book_id',
    type: DataType.INTEGER,
  })
  bookId: number;

  @Column({
    field: 'amount',
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    field: 'precio_unit',
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  unitPrice: number;
}