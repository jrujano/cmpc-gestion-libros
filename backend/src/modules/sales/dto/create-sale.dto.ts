import { IsArray, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleStatus } from '../interfaces/sale-status-interfaces';
import { CreateSaleItemDto } from './create-sale-item.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateSaleDto {
  @ApiProperty({
    description: 'Total amount of the sale',
    example: 199.99,
    type: Number,
  })
  @IsDecimal({ decimal_digits: '2' })
  @IsNotEmpty()
  total: number;

  @ApiPropertyOptional({
    description: 'ID of the customer making the purchase',
    example: 1,
    type: Number,
    required: false,
  })
  @IsInt()
  @IsOptional()
  customerId?: number;

  @ApiPropertyOptional({
    description: 'Status of the sale',
    enum: SaleStatus,
    example: SaleStatus.PENDING,
    required: false,
  })
  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  @ApiProperty({
    description: 'List of items in the sale',
    type: [CreateSaleItemDto],
    example: [
      {
        bookId: 1,
        quantity: 2,
        unitPrice: 49.99,
      },
      {
        bookId: 3,
        quantity: 1,
        unitPrice: 99.99,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}