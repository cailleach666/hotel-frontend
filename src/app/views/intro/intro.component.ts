import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgIf, NgStyle } from "@angular/common";
import { ImageService } from "../../core/services/imageService/image.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent implements OnInit {
  @Input() backgroundImages: string = '';
  backgroundImage: string = '';
  @Input() heading1: string = '';
  @Input() heading2: string = '';
  @Input() heading3: string = '';
  @Input() paragraph: string = '';
  @Input() buttonText: string = '';
  @Input() navigateTo: string = '';

  constructor(public imageService: ImageService,
              private readonly router: Router
  ) {}

  ngOnInit() {
    this.setBackgroundImage();
  }

  navigate() {
    if (this.navigateTo) {
      if (this.navigateTo.startsWith("/")) {
        this.router.navigate([this.navigateTo]);
      }
      else {
        const section = document.getElementById(this.navigateTo);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }

  setBackgroundImage() {
    switch (this.backgroundImages) {
      case 'rooms':
        this.backgroundImage = this.imageService.backgroundRoomsPicture;
        break;
      case 'home':
        this.backgroundImage = this.imageService.backgroundImage;
        break;
      case 'painting':
        this.backgroundImage = this.imageService.painting;
        break;
      default:
        this.backgroundImage = this.imageService.backgroundImage;
        break;
    }
  }

}
