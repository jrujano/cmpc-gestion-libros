export interface IInventory {
  idMovement?: number;
  bookId?: number;
  movementDate?: Date;
  movementDay: number;
  type?: string;
  reason?: string;
  responsibleUser?: string;
}

export enum InventoryMovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
}
