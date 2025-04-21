import { IsDecimal, IsInt, IsNotEmpty } from 'class-validator';

export class CreateSaleItemDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  unitPrice: number;
}