// src/modules/inventory/dto/inventory-filter.dto.ts
import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InventoryFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  bookId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
