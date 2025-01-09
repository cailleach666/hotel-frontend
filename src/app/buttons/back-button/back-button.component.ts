import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {ImageService} from "../../core/services/imageService/image.service";
import {LinkService} from "../../core/services/linkService/link.service";

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css'
})
export class BackButtonComponent {
  backImage: string
  homeLink: string

  constructor(private readonly imageService: ImageService, private readonly linkService: LinkService) {
    this.backImage = imageService.back
    this.homeLink = linkService.homePageLink
  }
}
