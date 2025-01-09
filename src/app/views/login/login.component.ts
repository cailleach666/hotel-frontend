import {Component, OnInit} from '@angular/core';
import {ImageService} from "../../core/services/imageService/image.service";
import {NgIf, NgStyle} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {BackButtonComponent} from "../../buttons/back-button/back-button.component";
import {LinkService} from "../../core/services/linkService/link.service";
import {AuthButtonComponent} from "../../buttons/auth-button/auth-button.component";
import {PasswordFieldComponent} from "../../password-field/password-field.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Client} from "../../core/models/client";
import {ClientService} from "../../core/services/clientService/client.service";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    BackButtonComponent,
    AuthButtonComponent,
    PasswordFieldComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  backgroundImage: string

  registerLink: string
  public showPassword: boolean = false;
  clientForm!: FormGroup
  formSubmitted: boolean = false;

  constructor(private readonly imageService: ImageService,
              private readonly linkService: LinkService,
              private readonly authService: AuthenticationService,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly route: ActivatedRoute,
              private readonly clientService: ClientService) {
    this.backgroundImage = imageService.backgroundImage
    this.registerLink = linkService.registerLink

  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.clientForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.clientForm.invalid) {
      return;
    }

    const newLogin: Client = this.clientForm.value;
    this.clientService.loginClient(newLogin).subscribe({
      next: (client) => {
        console.log('Client logged in successfully:', client);
        this.clientService.loginClient(newLogin).subscribe({
          next: (token) => {
            this.authService.login(token, client);
            this.router.navigate(['/profile']);
          },
          error: (error) => {
            console.error('Error during login:', error);
          }
        });
        this.clientForm.reset();
        this.formSubmitted = false;
      },
      error: (error) => {
        console.error('Error logging in client:', error);
        alert(error.error.message);

      }
    });
  }
}
