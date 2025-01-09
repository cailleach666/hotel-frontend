import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgIf, NgStyle} from "@angular/common";
import {ImageService} from "../../core/services/imageService/image.service";
import {BackButtonComponent} from "../../buttons/back-button/back-button.component";
import {LinkService} from "../../core/services/linkService/link.service";
import {AuthButtonComponent} from "../../buttons/auth-button/auth-button.component";
import {PasswordFieldComponent} from "../../password-field/password-field.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClientService} from "../../core/services/clientService/client.service";
import {Client} from "../../core/models/client";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    NgStyle,
    BackButtonComponent,
    AuthButtonComponent,
    PasswordFieldComponent,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  backgroundImage: string
  loginLink: string
  clientForm!: FormGroup
  public showPassword: boolean = false;
  formSubmitted: boolean = false;

  constructor(private readonly imageService: ImageService,
              private readonly linkService: LinkService,
              private readonly authService: AuthenticationService,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly route: ActivatedRoute,
              private readonly clientService: ClientService) {
    this.backgroundImage = imageService.backgroundImage
    this.loginLink = linkService.loginLink
  }

  ngOnInit(): void {
    this.createForm();
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    }
  }

  createForm() {
    this.clientForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.clientForm.invalid) {
      return;
    }

    const newClient: Client = this.clientForm.value;
    this.clientService.createClient(newClient).subscribe({
      next: (client) => {
        console.log('Client created successfully:', client);
        this.clientService.loginClient(newClient).subscribe({
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
        console.error('Error creating client:', error);
        alert(error.error.message);
      }
    });
  }
}
