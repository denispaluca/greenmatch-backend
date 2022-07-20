export interface Notification {
  supplierName: string;
  ppaId: string;
  buyerId: string;
  cancellationDate: Date;
  read: boolean;
}