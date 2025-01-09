import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

import {HeaderComponent} from "./views/header/header.component";
import {FooterComponent} from "./views/footer/footer.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'frontend';
  showHeaderFooter: boolean = true;

  constructor(private readonly router: Router) {
  }
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.showHeaderFooter =
        !this.router.url.includes('/login')
        && !this.router.url.includes('/register')
        && !this.router.url.includes('/admin');
    });
  }
}
