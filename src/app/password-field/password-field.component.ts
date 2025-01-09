import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.css'
})
export class PasswordFieldComponent {
  @Input() fieldText = ''
  public showPassword: boolean = false;
}
