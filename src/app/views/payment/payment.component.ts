import {Component, OnInit} from '@angular/core';
import {IntroComponent} from "../intro/intro.component";
import {NgForOf, NgIf, NgStyle, ViewportScroller} from "@angular/common";
import {ImageService} from "../../core/services/imageService/image.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthButtonComponent} from "../../buttons/auth-button/auth-button.component";
import {Reservation} from "../../core/models/reservation";
import {Router} from "@angular/router";
import {ReservationService} from "../../core/services/reservationService/reservation.service";
import {Room} from "../../core/models/room";
import {PaymentService} from "../../core/services/paymentService/payment.service";
import {Payment} from "../../core/models/payment";
import {RoomService} from "../../core/services/roomService/room.service";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    IntroComponent,
    NgStyle,
    FormsModule,
    ReactiveFormsModule,
    AuthButtonComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  backgroundImage: string;
  paymentForm! : FormGroup
  reservation!: Reservation
  loggedClientId!: number;
  room: any = {};
  editModes: { [key: number]: boolean } = {};

  constructor(private readonly imageService: ImageService,
              private readonly formBuilder: FormBuilder,
              private readonly router: Router,
              private readonly reservationService: ReservationService,
              private readonly authService: AuthenticationService,
              private readonly paymentService: PaymentService,
              private readonly roomService: RoomService,
              private readonly viewportScroller: ViewportScroller,
              ) {
    this.backgroundImage = imageService.backgroundImage
    const navigation = this.router.getCurrentNavigation()
    const state = navigation?.extras.state


    if (state) {
      this.reservation = state['reservation']
    } else {
      console.log('No reservation or room data found in navigation state')
    }

    this.roomService.getRoomById(this.reservation.roomId).subscribe({
      next: (room: Room) => {
        this.room = room;
      },
      error: (err) => {
        console.error('Error fetching room:', err);
      }
    });

  }

  ngOnInit(): void {
    this.createForm();
    this.setLoggedClientId();
    }

  createForm() {
    this.paymentForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required]],
    });
  }

  setLoggedClientId(): void {
    try {
      this.loggedClientId = this.authService.getClientId();
    } catch (error) {
      console.error('Error retrieving logged client ID:', error);
    }
  }

  onSubmit() {
    this.paymentForm.patchValue({ roomId: this.room.id });
    this.paymentForm.patchValue({ clientId: this.loggedClientId })

    const newPayment: Payment = {
      id: 0,
      cardNumber: this.paymentForm.value.cardNumber,
      paymentDate: new Date(),
      status: "CONFIRMED",
      amount: this.reservation.totalPrice,
      clientId: this.reservation.clientId,
      reservationId: this.reservation.id,
    }
    this.paymentService.createPayment(newPayment).subscribe({
      next: (response) => {
        console.log('Payment created successfully:', response);
        this.router.navigate(['/homepage']).then(() => {
          this.viewportScroller.scrollToPosition([0, 0]);
        });
      },
      error: (err) => {
        console.error()
      }
    })
  }
}
