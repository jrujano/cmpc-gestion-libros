export interface IInventory {
  idMovement?: number;
  bookId?: number;
  movementDate?: Date;
  movementDay?: number;
  type?: string;
  reason?: string;
  responsibleUser?: string;
  amount: number;
}

export enum InventoryMovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
}
