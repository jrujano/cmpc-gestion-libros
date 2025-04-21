import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { SaleItem } from './sale-item.model';

export enum SaleStatus {
  PENDING = 'pendiente',
  COMPLETED = 'completada',
  CANCELLED = 'cancelada',
}

@Table({ tableName: 'sales', timestamps: false })
export class Sale extends Model {
  @Column({
    field: 'sale_id',
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column({
    field: 'sale_date',
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  date: Date;

  @Column({
    field: 'total',
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  total: number;

  @Column({
    field: 'id_customer',
    type: DataType.INTEGER,
  })
  customerId: number;

  @Column({
    field: 'state',
    type: DataType.ENUM(...Object.values(SaleStatus)),
    defaultValue: SaleStatus.PENDING,
  })
  status: SaleStatus;

  @HasMany(() => SaleItem, 'sale_id')
  items: SaleItem[];
}