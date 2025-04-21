import { ApiProperty } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty()
  idMovement: number;

  @ApiProperty({ required: false })
  bookId?: number;

  @ApiProperty()
  movementDate: Date;

  // @ApiProperty()
  // movementDay: number;

  @ApiProperty({
    enum: ['ENTRY', 'EXIT', 'TRANSFER', 'ADJUSTMENT'],
    required: false,
  })
  type?: string;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty({ required: false })
  responsibleUser?: string;
}
