import { Routes } from '@angular/router';
import { HomepageComponent } from "./views/homepage/homepage.component";
import { RoomsComponent } from "./views/rooms/rooms.component";
import {LoginComponent} from "./views/login/login.component";
import {RegisterComponent} from "./views/register/register.component";
import {ProfileComponent} from "./views/profile/profile.component";
import {RoomBookingComponent} from "./views/room-booking/room-booking.component";
import { AdminViewComponent } from "./views/admin-view/admin-view.component";
import {PaymentComponent} from "./views/payment/payment.component";

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: HomepageComponent },
  { path: 'roomsInfo', component: RoomsComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'roomsBooking', component: RoomBookingComponent },
  { path: 'payment', component: PaymentComponent},
  { path: 'admin',  component: AdminViewComponent },


  { path: '**', redirectTo: 'homepage' }, //should be placed below all other defined routes
];
