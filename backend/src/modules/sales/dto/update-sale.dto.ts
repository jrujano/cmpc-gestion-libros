import { IsArray, IsDecimal, IsEnum, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { SaleStatus } from '../interfaces/sale-status-interfaces';
import { CreateSaleItemDto } from "./create-sale-item.dto";
import { Type } from 'class-transformer';

export class UpdateSaleDto {
    @IsDecimal({ decimal_digits: '2' })
    @IsOptional()
    total?: number;
  
    @IsInt()
    @IsOptional()
    customerId?: number;
  
    @IsEnum(SaleStatus)
    @IsOptional()
    status?: SaleStatus;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleItemDto)
    @IsOptional()
    items?: CreateSaleItemDto[];
  }