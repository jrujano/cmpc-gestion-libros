// src/modules/inventory/dto/inventory-report.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../../books/models/book.model';

export class InventoryReportItemDto {
  @ApiProperty()
  idMovement: number;

  @ApiProperty()
  movementDate: Date;

  @ApiProperty()
  type: string;

  @ApiProperty()
  reason: string;

  @ApiProperty({ type: () => Book })
  book?: Book;
}

export class InventoryReportDto {
  @ApiProperty({ type: () => [InventoryReportItemDto] })
  items: InventoryReportItemDto[];

  @ApiProperty()
  total: number;
}
