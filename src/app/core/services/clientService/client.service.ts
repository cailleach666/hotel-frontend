import { Injectable } from '@angular/core';
import {API_CONFIG} from "../../../shared/api-config";
import {HttpClient} from "@angular/common/http";
import {Client} from "../../models/client";
import {Observable} from "rxjs";
import {AuthenticationService} from "../authentication/authentication.service";
import {TokenService} from "../tokenService/token.service";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = `${API_CONFIG.baseUrl}/clients`

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  getClients(): Observable<Client[]> {
    const headers = this.authService.headers
    return this.http.get<Client[]>(`${this.apiUrl}`, { headers })
  }

  createClient(client: Client): Observable<Client> {
    const headers = this.authService.headers
    return this.http.post<Client>(`${this.apiUrl}/register`, client, { headers });
  }

  updateClient(client: Client): Observable<Client> {
    const headers = this.authService.headers
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client, { headers });
  }

  getClientById(clientId: number): Observable<Client> {
    const headers = this.authService.headers
    return this.http.get<Client>(`${this.apiUrl}/${clientId}`, { headers });
  }

  loginClient(client: Client): Observable<Client> {
    const headers = this.authService.headers
    return this.http.post<Client>(`${this.apiUrl}/login`, client, { headers });
  }

  deleteClient(client: Client): Observable<void> {
    const headers = this.authService.headers
    return this.http.delete<void>(`${this.apiUrl}/${client.id}`, { headers });
  }
}
