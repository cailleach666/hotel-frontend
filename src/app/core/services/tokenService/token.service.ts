import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private headers = new HttpHeaders();

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return this.headers;
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
    this.headers = new HttpHeaders();
  }
}
