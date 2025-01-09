export interface Reservation {
  id: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  numberOfGuests: number;
  status: string | null;
  clientId: number;
  roomId: number;
}
