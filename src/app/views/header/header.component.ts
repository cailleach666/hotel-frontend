import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {ImageService} from "../../core/services/imageService/image.service";
import {LinkService} from "../../core/services/linkService/link.service";
import {NgIf} from "@angular/common";
import { AuthenticationService } from "../../core/services/authentication/authentication.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  logoPic: string
  roomsLink: string
  homeLink: string
  profileLink: string
  adminLink: string
  registerLink

  constructor(private readonly imageService: ImageService,
              private readonly linkService: LinkService,
              public readonly authService: AuthenticationService) {
    this.logoPic = imageService.logoPic
    this.registerLink = linkService.registerLink
    this.profileLink = linkService.profileLink
    this.homeLink = linkService.homePageLink
    this.roomsLink = linkService.roomsLink
    this.adminLink = linkService.adminLink
  }
}
