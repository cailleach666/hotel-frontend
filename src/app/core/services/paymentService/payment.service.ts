import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Payment} from "../../models/payment";
import {API_CONFIG} from "../../../shared/api-config";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${API_CONFIG.baseUrl}/payments`

  constructor(private readonly http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}`)
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}`, payment)
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/${payment.id}`, payment);
  }

  getPaymentById(paymentId: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }

  deletePayment(payment: Payment): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${payment.id}`)
  }
}
