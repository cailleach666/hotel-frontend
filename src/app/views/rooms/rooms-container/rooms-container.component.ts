import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {NgIf, NgStyle, ViewportScroller} from "@angular/common";
import { ImageService } from "../../../core/services/imageService/image.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms-container',
  standalone: true,
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './rooms-container.component.html',
  styleUrl: './rooms-container.component.css'
})
export class RoomsContainerComponent implements OnInit {

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = '';
  @Input() backgroundImages: string = '';
  backgroundImage: string = '';
  @Input() navigateTo: string = '';

  constructor(public readonly imageService: ImageService,
              private readonly router: Router,
              private readonly viewportScroller: ViewportScroller
  ) {}

  navigate(): void {
    if (this.navigateTo) {
      this.router.navigate([this.navigateTo]).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }
  ngOnInit() {
    this.setBackgroundImage();
  }

  setBackgroundImage() {
    switch (this.backgroundImages) {
      case 'single':
        this.backgroundImage = this.imageService.singleRoom;
        break;
      case 'double':
        this.backgroundImage = this.imageService.doubleRoom;
        break;
      case 'twin':
        this.backgroundImage = this.imageService.twinRoom;
        break;
      case 'luxury':
        this.backgroundImage = this.imageService.luxuryRoom;
        break;
      default:
        this.backgroundImage = this.imageService.doubleRoom;
        break;
    }
  }
}
