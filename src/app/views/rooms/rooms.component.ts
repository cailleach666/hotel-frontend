import {Component, OnInit} from '@angular/core';
import { IntroComponent } from "../intro/intro.component";
import { RoomsContainerComponent } from "./rooms-container/rooms-container.component";
import {FeatureCardComponent} from "../homepage/feature-card/feature-card.component";
import {RoomType} from "../../core/enums/room-type";

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    IntroComponent,
    RoomsContainerComponent,
    FeatureCardComponent
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
  longText: string = `Each of our bright, light-flooded rooms come with everything
                      you could possibly need for a comfortable stay. And yes, comfort
                      isn’t our only objective, we also value good design, sleek contemporary
                      furnishing complemented by the rich tones of nature’s palette as
                      visible from our rooms’ sea-view windows and terraces.`;

  singleRoom: string = 'Our Single Rooms are designed for those seeking comfort and ' +
                        'solitude. Perfect for solo travelers, each room provides a ' +
                        'peaceful retreat with all the amenities you need to unwind and enjoy your stay.';

  doubleRoom: string = 'Our Double Rooms offer the ideal space for couples or friends looking to ' +
                        'share a comfortable experience. Enjoy spacious surroundings with modern amenities ' +
                        'and a relaxing atmosphere, perfect for a restful night’s sleep.';

  twinRoom: string = 'Our Twin Rooms are designed for guests who prefer two separate beds. Whether ' +
                      'you’re traveling with a friend or colleague, this room provides the perfect ' +
                      'blend of comfort and privacy, offering a restful space with ample amenities.';

  luxuryRoom: string = 'Indulge in the elegance of our Deluxe Rooms, where every detail has ' +
                        'been carefully crafted for an extraordinary stay. Featuring premium furnishings, ' +
                        'expansive spaces, and stunning views, this room offers an unparalleled experience in ' +
                        'comfort and style.';

  constructor() {}

  ngOnInit(): void {

  }

    protected readonly RoomType = RoomType;
}
