import { Injectable } from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_CONFIG} from "../../../shared/api-config";
import {Amenity} from "../../models/amenity";

@Injectable({
  providedIn: 'root'
})
export class AmenityService {

  private apiUrl = `${API_CONFIG.baseUrl}/amenities`

  private authHeader = localStorage.getItem("Authorization") || ""

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  createAmenity(amenity: Amenity) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.post<Amenity>(`${this.apiUrl}/private`, amenity, { headers });
  }

  updateAmenity(id: number, amenity: Amenity) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.put<Amenity>(`${this.apiUrl}/private/${id}`, amenity, { headers });
  }

  getAmenity(id: number) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.get<Amenity>(`${this.apiUrl}/${id}`, { headers });
  }

  getAmenities() {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.get<Amenity[]>(`${this.apiUrl}`, { headers });
  }

  deleteAmenity(id: number) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.delete<void>(`${this.apiUrl}/private/${id}`, { headers });
  }
}
