import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.css'
})
export class FeatureCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() buttonText: string = 'EXPLORE';
  @Input() imageSrc: string = '';
  @Input() navigateTo: string = '';

  constructor(private readonly router: Router) {
  }

  navigate(): void {
    if (this.navigateTo) {
      this.router.navigate([this.navigateTo]);
    }
  }
}
