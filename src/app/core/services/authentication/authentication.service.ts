import { Injectable } from '@angular/core';
import {Client} from "../../models/client";
import {Router} from "@angular/router";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  headers = new HttpHeaders()

  constructor(private readonly router: Router,

  ) {}

  getRoles(): string[] {
    const clientInfo = this.getClientInfo();
    return clientInfo?.roles || [];
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(token: Client, clientInfo: Client): void {
    localStorage.setItem('authToken', JSON.stringify(token));
    localStorage.setItem('clientInfo', JSON.stringify(clientInfo));
    this.setAuthHeaders()
    console.log("Headers:", this.headers)
  }


  getClientId(): number {
    const token = localStorage.getItem('clientInfo');
    if (token) {
      try {
        const payload = JSON.parse(token);
        return payload.id;
      } catch (e) {
        console.error('Error parsing token:', e);
        throw new Error('Invalid token format');
      }
    }
    throw new Error('Client ID not found');
  }

  setAuthHeaders() {
    const storedData = localStorage.getItem('authToken');
    if (storedData) {
      const tokenObj = JSON.parse(storedData);
      const token = tokenObj.token;

      if (token) {
        this.headers = this.headers.set('Authorization', `Bearer ${token}`);
        localStorage.setItem("Authorization", `Bearer ${token}`)
      }
    }
  }

  getClientInfo() {
    const clientInfo = localStorage.getItem('clientInfo');
    return clientInfo ? JSON.parse(clientInfo) : null;
  }

  logout(): void {
    localStorage.clear()
    this.router.navigate(['/login']);
  }

}
