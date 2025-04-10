import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'customers',
  timestamps: true,
  underscored: true,
  createdAt: 'registration_date',
  updatedAt: false,
})
export class Customer extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_customer',
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'last_name',
  })
  lastName: string;

  @Column({
    type: DataType.STRING(100),
    unique: true,
    field: 'email',
  })
  email: string;

  @Column({
    type: DataType.STRING(20),
    field: 'phone',
  })
  phone: string;

  @Column({
    type: DataType.TEXT,
    field: 'address',
  })
  address: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    field: 'registration_date',
  })
  registrationDate: Date;
}
