import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import { ReservationService } from '../../../core/services/reservationService/reservation.service';
import { RoomService } from '../../../core/services/roomService/room.service';
import { Room } from '../../../core/models/room';
import { Reservation } from '../../../core/models/reservation';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import {
  DatePipe,
  NgForOf,
  NgIf, NgStyle
} from "@angular/common";
import { AuthenticationService } from "../../../core/services/authentication/authentication.service";
import { RoomType } from "../../../core/enums/room-type";
import {ActivatedRoute, Router} from "@angular/router";
import {SearchCriteria} from "../../../core/models/searchCriteria";
import {FullCalendarModule} from "@fullcalendar/angular";
import {Amenity} from "../../../core/models/amenity";

@Component({
  selector: 'app-room-booking-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgStyle,
    FullCalendarModule,
    DatePipe,
  ],
  templateUrl: './room-booking-list.component.html',
  styleUrl: './room-booking-list.component.css'
})
export class RoomBookingListComponent implements OnInit {
  rooms: Room[] = [];
  loggedClientId!: number;

  checkInDate: string = '';
  checkOutDate: string = '';
  roomGuests: { [key: number]: number } = {};

  sortOrder: 'asc' | 'desc' = 'asc';
  roomDescriptions = {
    'SINGLE': 'Perfect for solo travelers who need a cozy retreat.',
    'DOUBLE': 'Ideal for couples or close friends who want comfort and convenience.',
    'TWIN': 'Great for two guests looking for separate beds but shared space.',
    'DELUXE': 'For those who want extra luxury and space for the whole family or group.'
  };

  reservationForm!: FormGroup;
  searchForm!: FormGroup;

  roomTypes = Object.values(RoomType);

  currentPage: number = 0;
  currentSearchCriteria: SearchCriteria = {};
  roomType: RoomType | null = null;

  selectedRoom: Room | null = null;
  blockedDates: Date[] = [];
  calendarEvents: any[] = [];
  selectedRoomIndex: number = -1;
  selectedRowIndex: number = -1;
  popupPosition: string = '0px';

  constructor(
    private reservationService: ReservationService,
    private authService: AuthenticationService,
    private roomService: RoomService,
    private fb: FormBuilder,
    private el: ElementRef,
  ) { console.log("init")}

  ngOnInit(): void {
    this.setLoggedClientId();
    this.createReservationForm();
    this.createSearchForm();
    this.fetchRooms();
    document.addEventListener('click', this.closePopupOutside.bind(this));
  }

  setLoggedClientId(): void {
    try {
      this.loggedClientId = this.authService.getClientId();
    } catch (error) {
      console.error('Error retrieving logged client ID:', error);
    }
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      type: [''],
      minPrice: [''],
      maxPrice: [''],
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]],
    });
  }

  createReservationForm(): void {
    this.reservationForm = this.fb.group({
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]],
      numberOfGuests: [0, [Validators.required, Validators.min(1)]],
      roomId: [null, Validators.required],
      clientId: [this.loggedClientId, Validators.required],
    });
  }

  fetchRooms(page: number = 0): void {
    const searchParams = { ...this.currentSearchCriteria, page: page };
    this.roomService.searchRooms(searchParams).subscribe({
      next: (data) => {
        this.rooms = data;
        this.sortRoomsByPrice();
        this.rooms.forEach(room => {
          this.roomGuests[room.id] = 0;
        });
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Error fetching rooms:', err);
      }
    });
  }

  onSearch() {
    const searchCriteria = this.searchForm.value;
    this.currentSearchCriteria = searchCriteria;
    this.roomService.searchRooms(searchCriteria).subscribe({
      next: (data) => {
        this.rooms = data;
        this.currentPage = 0;
      },
      error: (err) => {
        console.error('Error searching rooms:', err);
      }
    });
  }

  sortRoomsByPrice(): void {
    this.rooms.sort((a, b) => {
      const priceA = a.price;
      const priceB = b.price;

      if (this.sortOrder === 'asc') {
        return priceA - priceB;
      } else {
        return priceB - priceA;
      }
    });
  }

  onSeeInfo(room: Room, index: number): void {
    this.selectedRoomIndex = index;
    this.selectedRowIndex = index;

    this.roomService.getRoom(room.id).subscribe(
      (fetchedRoom: Room) => {
        this.selectedRoom = fetchedRoom;

        const rowElement = this.el.nativeElement.querySelectorAll('tr')[index];
        const rect = rowElement.getBoundingClientRect();
        this.popupPosition = `${rect.bottom + 60 + window.scrollY}px`;

        this.roomService.getRoomAmenities(room.id).subscribe(
          (amenities: Amenity[]) => {
            this.selectedRoom!.amenities = amenities;
          },
          (error) => {
            console.error('Error fetching room amenities:', error);
          }
        );

        this.roomService.getRoomAvailability(room.id).subscribe(
          (availabilityDates: Date[]) => {
            this.blockedDates = availabilityDates;
          },
          (error) => {
            console.error('Error fetching room availability:', error);
          }
        );

      },
      (error) => {
        console.error('Error fetching room details:', error);
      }
    );
  }

  closePopupOutside(event: MouseEvent): void {
    const popupElement = this.el.nativeElement.querySelector('.room-info-popup');
    if (popupElement && !popupElement.contains(event.target)) {
      this.selectedRoom = null;
      this.selectedRowIndex = -1;
    }
  }

  fetchRoomAvailability(roomId: number): void {
    this.roomService.getRoomAvailability(roomId).subscribe(availability => {
      this.blockedDates = availability;
    });
  }

  clearFilters() {
    this.searchForm.reset({
      type: '',
      minPrice: '',
      maxPrice: '',
    });
    this.currentSearchCriteria = {};
    this.fetchRooms();
  }

  onBook(room: Room): void {
    this.reservationForm.patchValue({ roomId: room.id });
    this.reservationForm.patchValue({ clientId: this.loggedClientId })

    const formValues = this.reservationForm.value;

    const guestCount = formValues.numberOfGuests;
    const checkInDate = formValues.checkInDate;
    const checkOutDate = formValues.checkOutDate;

    if (!checkInDate) {
      console.error('Please fill in all required fields: checkInDate');
      alert('Please fill in all required fields: checkInDate')
      return;
    }
    if (!checkOutDate) {
      console.error('Please fill in all required fields: checkOutDate');
      alert('Please fill in all required fields: checkOutDate')
      return;
    }
    if (guestCount === 0) {
      console.error('Guest count cant be 0');
      alert('Guest count cant be 0')
      return;
    }

    const selectedRoom = this.rooms.find(room => room.id === formValues.roomId);

    if (this.reservationForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    if (selectedRoom && confirm(`Book ${selectedRoom.type} room for ${this.calculateTotalPrice(selectedRoom)}€?`)) {
      const newReservation: Reservation = this.reservationForm.value;
      selectedRoom.available = false;
      this.reservationService.createReservation(newReservation).subscribe({
        next: (reservation) => {
          console.log('Reservation created:', reservation);
          this.reservationForm.reset({ clientId: this.loggedClientId });
          this.clearFilters();
          alert('Reservation created! Confirm reservation in profile');

        },
        error: (err) => {
          console.error('Error creating reservation:', err);
        }
      });
    }
  }

  calculateTotalPrice(room: Room): number {
    if (!this.checkInDate || !this.checkOutDate) {
      return 0;
    }

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const daysStayed = timeDifference / (1000 * 3600 * 24);

    if (daysStayed <= 0) {
      return 0;
    }

    return room.price * daysStayed;
  }

  updateDateInForm(fieldName: string, value: string): void {
    if (fieldName === 'checkInDate' || fieldName === 'checkOutDate') {
      this.reservationForm.patchValue({ [fieldName]: value });
    }
  }

  updateGuestCount(event: any, room: Room): void {
    const guestCount = +event.target.value;
    this.reservationForm.patchValue({ numberOfGuests: guestCount, roomId: room.id });
  }

  getGuestOptions(room: Room): number[] {
    switch (room.type) {
      case 'SINGLE':
        return [1];
      case 'DOUBLE':
      case 'TWIN':
        return [1, 2];
      case 'DELUXE':
        return [1, 2, 3, 4, 5];
      default:
        return [];
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchRooms(this.currentPage);
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchRooms(this.currentPage);
  }

  emptyRows(roomCount: number): any[] {
    const maxRows = 5;
    const emptyRowCount = Math.max(0, maxRows - roomCount);
    return Array(emptyRowCount);
  }

}
