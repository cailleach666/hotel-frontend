export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
}
