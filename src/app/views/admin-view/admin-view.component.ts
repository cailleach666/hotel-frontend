import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import { Room } from "../../core/models/room";
import { RoomType } from "../../core/enums/room-type";
import { RoomService } from "../../core/services/roomService/room.service";
import { RoomListComponent } from "./room-list/room-list.component";
import {IntroComponent} from "../intro/intro.component";
import {RoomManagementComponent} from "./room-management/room-management.component";
import {ClientManagementComponent} from "./client-management/client-management.component";
import {AmenityManagementComponent} from "./amenity-management/amenity-management.component";
import {FooterComponent} from "../footer/footer.component";
import {ReservationManagementComponent} from "./reservation-management/reservation-management.component";
import {PaymentManagementComponent} from "./payment-management/payment-management.component";

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    RoomListComponent,
    IntroComponent,
    RoomManagementComponent,
    ClientManagementComponent,
    RouterLink,
    AmenityManagementComponent,
    NgIf,
    FooterComponent,
    ReservationManagementComponent,
    PaymentManagementComponent
  ],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css'
})
export class AdminViewComponent {
  activeSection: string = 'room';

  constructor() {}
}
