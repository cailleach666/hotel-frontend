export interface Payment {
  id: number;
  cardNumber: string;
  paymentDate: Date;
  status: string | null;
  amount: number;
  clientId: number;
  reservationId: number;
}
