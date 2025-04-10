import { IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { InventoryMovementType } from '../interfaces/inventory.interface';

export class CreateInventoryDto {
  @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsNumber()
  movementDay: number;

  @IsOptional()
  @IsEnum(InventoryMovementType)
  type?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  responsibleUser?: string;
}
