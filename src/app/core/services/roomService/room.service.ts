import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Room} from "../../models/room";
import {AuthenticationService} from "../authentication/authentication.service";
import {API_CONFIG} from "../../../shared/api-config";
import {SearchCriteria} from "../../models/searchCriteria";
import {Amenity} from "../../models/amenity";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private readonly apiUrl = `${API_CONFIG.baseUrl}/rooms`

  private readonly authHeader = localStorage.getItem("Authorization") ?? ""

  constructor(private readonly http: HttpClient, private readonly authService: AuthenticationService) {}

  getRoomById(id: number): Observable<Room> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    return this.http.get<Room>(`${this.apiUrl}/${id}`, { headers })
  }

  createRoom(room: Room): Observable<Room> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    return this.http.post<Room>(`${this.apiUrl}/private`, room, { headers });
  }

  getRooms(): Observable<Room[]> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    return this.http.get<Room[]>(`${this.apiUrl}`, { headers });
  }

  getRoom(id: number): Observable<Room> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    return this.http.get<Room>(`${this.apiUrl}/${id}`, { headers });
  }

  updateRoom(id: number, room: Room): Observable<Room> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    return this.http.put<Room>(`${this.apiUrl}/private/${id}`, room, { headers });
  }

  deleteRoom(id: number): Observable<void> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    return this.http.delete<void>(`${this.apiUrl}/private/${id}`, { headers });
  }

  searchRooms(searchCriteria: SearchCriteria): Observable<Room[]> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader)
    let params = new HttpParams();
    if (searchCriteria.type) {
      params = params.set('type', searchCriteria.type);
    }
    if (searchCriteria.minPrice) {
      params = params.set('minPrice', searchCriteria.minPrice);
    }
    if (searchCriteria.maxPrice) {
      params = params.set('maxPrice', searchCriteria.maxPrice);
    }
    if (searchCriteria.checkInDate) {
      params = params.set('checkInDate', searchCriteria.checkInDate);
    }
    if (searchCriteria.checkOutDate) {
      params = params.set('checkOutDate', searchCriteria.checkOutDate);
    }
    if (searchCriteria.page) {
      params = params.set('page', searchCriteria.page.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/search`, { params, headers }).pipe(
      map(response => response.content || response)
    );
  }

  getRoomAvailability(id: number): Observable<Date[]> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.get<Date[]>(`${this.apiUrl}/${id}/availability`, { headers });
  }

  createMultipleRooms(startRoomNumber: string, numberOfRooms: number, price: number, type: string): Observable<Room[]> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    const body = { startRoomNumber, numberOfRooms, price, type };
    return this.http.post<Room[]>(`${this.apiUrl}/private/create-multiple`, body, { headers });
  }

  addAmenityToRoom(roomId: number, amenityId: number) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.post<void>(`${this.apiUrl}/private/${roomId}/amenities/${amenityId}`, {}, { headers });
  }

  getRoomAmenities(roomId: number) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.get<Amenity[]>(`${this.apiUrl}/${roomId}/amenities`, { headers });
  }

  removeAmenityFromRoom(roomId: number, amenityId: number) {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.delete<void>(`${this.apiUrl}/private/${roomId}/amenities/${amenityId}`, { headers });
  }

  deleteAllRooms(): Observable<void> {
    const headers = new HttpHeaders().set("Authorization", this.authHeader);
    return this.http.delete<void>(`${this.apiUrl}/private/delete-all`, { headers });
  }

  isRoomAvailable(roomId: number, checkInDate: string, checkOutDate: string): Observable<boolean> {
    return this.getRoomAvailability(roomId).pipe(
      map((unavailableDates: Date[]) => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        for (let currentDate = new Date(checkIn); currentDate <= checkOut; currentDate.setDate(currentDate.getDate() + 1)) {
          const currentDateStr = currentDate.toISOString().split('T')[0];

          if (unavailableDates.some(date => date.toISOString().split('T')[0] === currentDateStr)) {
            return false;
          }
        }
        return true;
      })
    );
  }
}
