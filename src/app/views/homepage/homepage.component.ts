import { Component } from '@angular/core';
import {NgStyle} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {RouterOutlet} from "@angular/router";
import {FeatureCardComponent} from "./feature-card/feature-card.component";
import {ImageService} from "../../core/services/imageService/image.service";
import {IntroComponent} from "../intro/intro.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    NgStyle,
    HeaderComponent,
    RouterOutlet,
    FeatureCardComponent,
    IntroComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  featureCardPic1: string;
  featureCardPic2: string
  backgroundImage: string

  constructor(private readonly imageService: ImageService) {
    this.featureCardPic1 = imageService.featureCardPic1
    this.featureCardPic2 = imageService.featureCardPic2
    this.backgroundImage = imageService.backgroundImage
  }
}
