import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Payment} from "../../../core/models/payment";
import {PaymentService} from "../../../core/services/paymentService/payment.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './payment-management.component.html',
  styleUrl: './payment-management.component.css'
})
export class PaymentManagementComponent implements OnInit{
  editModes: { [key: number]: boolean } = {};
  payments: Payment[] = [];

  constructor(private readonly paymentService: PaymentService,
              private readonly route: ActivatedRoute,
              private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.fetchPayments()
  }

  fetchPayments(): void {
    this.paymentService.getPayments().subscribe({
      next:  (data) => {
        this.payments = data
      },
      error: (err) => {
        console.log('Error fetching payments:', err)
      }
    })
  }

  toggleEdit(payment: Payment): void {
    const isEditing = this.editModes[payment.id];

    if (isEditing) {
      this.paymentService.updatePayment(payment).subscribe({
        next: () => {
          this.editModes[payment.id] = false;
          console.log('Payment updated successfully:', payment);
        },
        error: (err) => {
          console.error('Error updating reservation:', err);
        }
      });
    } else {
      this.editModes[payment.id] = true;
    }
  }

  onDeletePayment(payment: Payment) : void {
    if (confirm('Are you sure you want to delete the payment?')) {
      this.paymentService.deletePayment(payment).subscribe(() => {
        console.log(`Payment with ID ${payment.id} was deleted successfully`);
      });
      window.location.reload();
    }
  }
}
