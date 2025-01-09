import {Component, OnInit} from '@angular/core';
import {IntroComponent} from "../intro/intro.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Client} from "../../core/models/client";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";
import {ClientService} from "../../core/services/clientService/client.service";
import {Router} from "@angular/router";
import {ReservationService} from "../../core/services/reservationService/reservation.service";
import {Reservation} from "../../core/models/reservation";
import {NgForOf, NgIf, NgStyle, ViewportScroller} from "@angular/common";
import {RoomService} from "../../core/services/roomService/room.service";
import {ImageService} from "../../core/services/imageService/image.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    IntroComponent,
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    NgIf,
    NgStyle
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  clientForm!: FormGroup;
  clientInfo: Client | null = null;
  clientId!: number;
  reservations: Reservation[] = [];
  isEditing: boolean = false;
  editModes: { [key: number]: boolean } = {};
  roomNumbers: { [key: number]: string } = {};
  backgroundImage: string;


  constructor(
    private readonly imageService: ImageService,
    private readonly authService: AuthenticationService,
    private readonly clientService: ClientService,
    private readonly reservationService: ReservationService,
    private readonly roomService: RoomService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly viewportScroller: ViewportScroller,
  ) {
    this.backgroundImage = imageService.backgroundImage
  }

  ngOnInit(): void {
    this.clientInfo = this.authService.getClientInfo();
    if (!this.clientInfo) {
      this.router.navigate(['/login']);
      return;
    }
    this.createForm();
    this.loadClientId();
    this.loadClientInfo();
    this.loadReservations();
  }

  loadClientId(): void {
    try {
      this.clientId = this.authService.getClientId();
    } catch (error) {
      console.error('Error loading client ID:', error);
    }
  }

  loadClientInfo(): void {
    if (!this.clientId) {
      console.error('Client ID not found');
      this.router.navigate(['/login']);
      return;
    }

    this.clientService.getClientById(this.clientId).subscribe({
      next: (client) => {
        this.clientInfo = client;
        this.createForm();
      },
      error: (err) => {
        console.error('Error fetching client data:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  loadReservations(): void {
    const clientId = this.authService.getClientId();
    this.reservationService.getReservationsByClientId(clientId).subscribe({
      next: (data) => {
        this.reservations = data;
        this.reservations.forEach((res) => {
          this.editModes[res.id] = false;
          this.loadRoomNumber(res.roomId);
        });
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
      },
    });
  }

  loadRoomNumber(roomId: number): void {
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.roomNumbers[roomId] = room.roomNumber;
      },
      error: (err) => {
        console.error('Error loading room:', err);
        this.roomNumbers[roomId] = 'Unknown';
      },
    });
  }

  confirmReservation(reservation: Reservation) {
    this.router.navigate(['/payment'], {
      state: {
        reservation: reservation,
      }
    }).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  logout(): void {
    this.authService.logout();
  }

  toggleEdit(reservation: Reservation): void {
    const isEditing = this.editModes[reservation.id];

    if (isEditing) {
      this.reservationService.updateReservation(reservation.id, reservation).subscribe({
        next: () => {
          this.editModes[reservation.id] = false;
          console.log('Reservation updated successfully:', reservation);
        },
        error: (err) => {
          console.error('Error updating reservation:', err);
        }
      });
    } else {
      this.editModes[reservation.id] = true;
    }
  }


  deleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(
          (res) => res.id !== reservationId
        );
        console.log('Reservation deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting reservation:', err);
      },
    });
  }


  createForm() {
    if (this.clientInfo) {
      this.clientForm = this.formBuilder.group({
        firstName: [{ value: this.clientInfo.firstName, disabled: !this.isEditing }, [Validators.required]],
        lastName: [{ value: this.clientInfo.lastName, disabled: !this.isEditing }, [Validators.required]],
        email: [{ value: this.clientInfo.email, disabled: !this.isEditing }, [Validators.required, Validators.email]],
        phone: [{ value: this.clientInfo.phone ?? '', disabled: !this.isEditing }]
      });
    }
  }

  onEditClick() {
    this.isEditing = !this.isEditing;
    this.clientForm.controls['firstName'].enable();
    this.clientForm.controls['lastName'].enable();
    this.clientForm.controls['email'].enable();
    this.clientForm.controls['phone'].enable();
  }

  onSubmit() {
    if (this.clientForm.invalid) {
      return;
    }

    const updatedClient: Client = { ...this.clientInfo, ...this.clientForm.value };

    this.clientService.updateClient(updatedClient).subscribe({
      next: (updatedClient) => {
        console.log('Client updated successfully:', updatedClient);
        this.authService.login(JSON.parse(localStorage.getItem('authToken') ?? ''), updatedClient);
        this.isEditing = false;
        this.createForm();
      },
      error: (error) => {
        console.error('Error updating client:', error);
      }
    });
  }
}
