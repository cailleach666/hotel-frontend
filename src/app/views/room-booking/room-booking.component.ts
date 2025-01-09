import {Component, OnInit} from '@angular/core';
import { IntroComponent } from "../intro/intro.component";
import { RoomListComponent } from "../admin-view/room-list/room-list.component";
import {ActivatedRoute, Router} from '@angular/router';
import {RoomBookingListComponent} from "./room-booking-list/room-booking-list.component";
import {ImageService} from "../../core/services/imageService/image.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-room-booking',
  standalone: true,
  imports: [
    IntroComponent,
    RoomListComponent,
    RoomBookingListComponent,
    NgStyle
  ],
  templateUrl: './room-booking.component.html',
  styleUrl: './room-booking.component.css'
})
export class RoomBookingComponent implements OnInit {
  backgroundImage: string;
  roomType?: string;

  constructor(private readonly route: ActivatedRoute,
              private readonly imageService: ImageService,
              private readonly router: Router
  ) {
    this.backgroundImage = imageService.backgroundImage
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.roomType = params['type'];
    });
  }



  goBack(): void {
    this.router.navigate(['/roomsInfo']);
  }
}
