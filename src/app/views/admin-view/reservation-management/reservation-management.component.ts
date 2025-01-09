import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Reservation} from "../../../core/models/reservation";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReservationService} from "../../../core/services/reservationService/reservation.service";

@Component({
  selector: 'app-reservation-management',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './reservation-management.component.html',
  styleUrl: './reservation-management.component.css'
})
export class ReservationManagementComponent implements OnInit{
  reservations: Reservation[] = [];

  constructor(private readonly formBuilder: FormBuilder,
              private readonly reservationService: ReservationService) {
  }

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservationService.getReservations().subscribe({
      next:  (data) => {
        this.reservations = data
      },
      error: (err) => {
        console.log('Error fetching clients:', err)
      }
    })
  }



  onDeleteReservation(reservation: Reservation) : void {
    if (confirm('Are you sure you want to delete the reservation?')) {
      this.reservationService.deleteReservation(reservation.id).subscribe(() => {
        console.log(`Reservation with ID ${reservation.id} was deleted successfully`);
      });
      window.location.reload();
    }
  }

}
