import { Component } from '@angular/core';
import {ImageService} from "../../core/services/imageService/image.service";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  footerLogoPic: string
  facebookIcon: string
  twitterIcon: string
  instagramIcon: string

  constructor(private readonly imageService: ImageService) {
    this.footerLogoPic = imageService.logoFooterPic
    this.facebookIcon = imageService.facebookIcon
    this.twitterIcon = imageService.twitterIcon
    this.instagramIcon = imageService.instagramIcon
  }
}
