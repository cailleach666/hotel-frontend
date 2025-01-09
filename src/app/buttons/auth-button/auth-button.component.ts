import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-auth-button',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css'
})
export class AuthButtonComponent {
  @Input() anotherAuth = ''
  @Input() text = ''
  @Input() buttonText = ''
}
