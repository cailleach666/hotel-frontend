import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AmenityService } from "../../../core/services/amenity/amenity.service";
import {Amenity} from "../../../core/models/amenity";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {Room} from "../../../core/models/room";
import {RoomService} from "../../../core/services/roomService/room.service";

@Component({
  selector: 'app-amenity-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    CurrencyPipe
  ],
  templateUrl: './amenity-management.component.html',
  styleUrl: './amenity-management.component.css'
})
export class AmenityManagementComponent implements OnInit {
  amenityForm!: FormGroup;
  amenities: Amenity[] = [];
  paginatedAmenities: Amenity[] = [];

  editModes: { [key: number]: boolean } = {};
  currentPage: number = 0;
  maxRowsPerPage: number = 3;

  assignAmenityForm!: FormGroup;
  rooms: Room[] = [];
  filteredRooms: Room[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private amenityService: AmenityService,
    private roomService: RoomService,
  ) {}

  ngOnInit(): void {
    this.createAmenityForm();
    this.fetchAmenities();
    this.fetchRooms();
    this.createAssignAmenityForm();
  }

  fetchAmenities(): void {
    this.amenityService.getAmenities().subscribe({
      next: (data) => {
        this.amenities = this.sortAmenitiesById(data);
        this.amenities.forEach(amenity => this.editModes[amenity.id] = false);
        this.updatePaginatedAmenities();
      },
      error: (err) => {
        console.error('Error fetching amenities:', err);
      }
    });
  }

  createAssignAmenityForm() {
    this.assignAmenityForm = this.formBuilder.group({
      roomNumber: ['', Validators.required],
      amenityId: ['', Validators.required],
    });
  }

  fetchRooms() {
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
      this.filteredRooms = rooms;
    });
  }

  sortAmenitiesById(amenities: Amenity[]): Amenity[] {
    return amenities.sort((a, b) => a.id - b.id);
  }

  updatePaginatedAmenities(): void {
    const start = this.currentPage * this.maxRowsPerPage;
    const end = start + this.maxRowsPerPage;
    this.paginatedAmenities = this.amenities.slice(start, end);
  }

  createAmenityForm() {
    this.amenityForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      additionalCost: ['', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.amenityForm.invalid) {
      return;
    }

    const newAmenity = this.amenityForm.value;
    this.amenityService.createAmenity(newAmenity).subscribe({
      next: (amenity) => {
        console.log('Amenity created successfully:', amenity);
        this.amenityForm.reset();
      },
      error: (error) => {
        console.error('Error creating amenity:', error);
      }
    });
  }

  onAssignAmenity() {
    if (this.assignAmenityForm.invalid) {
      return;
    }
    const roomNumber = this.assignAmenityForm.value.roomNumber;
    const amenityId = this.assignAmenityForm.value.amenityId;

    const selectedRoom = this.rooms.find(room => room.roomNumber === roomNumber);
    if (!selectedRoom) {
      console.log('Room not found');
      return;
    }
    this.roomService.addAmenityToRoom(selectedRoom.id, amenityId).subscribe({
      next: () => {
        console.log('Amenity assigned to room successfully');
      },
      error: (err) => {
        console.error('Error assigning amenity:', err);
      }
    });
  }

  onDeleteAmenityFromRoom() {
    if (this.assignAmenityForm.invalid) {
      return;
    }
    const roomNumber = this.assignAmenityForm.value.roomNumber;
    const amenityId = this.assignAmenityForm.value.amenityId;

    const selectedRoom = this.rooms.find(room => room.roomNumber === roomNumber);
    if (!selectedRoom) {
      console.log('Room not found');
      return;
    }

    this.roomService.removeAmenityFromRoom(selectedRoom.id, amenityId).subscribe({
      next: () => {
        console.log('Amenity removed from the room successfully');
      },
      error: (err) => {
        console.error('Error removing amenity:', err);
      }
    });
  }

  toggleEdit(amenity: Amenity): void {
    const isEditing = this.editModes[amenity.id];

    if (isEditing) {
      this.amenityService.updateAmenity(amenity.id, amenity).subscribe({
        next: () => {
          this.editModes[amenity.id] = false;
          console.log('Amenity updated successfully:', amenity);
        },
        error: (err) => {
          console.error('Error updating amenity:', err);
        }
      });
    } else {
      this.editModes[amenity.id] = true;
    }
  }

  deleteAmenity(amenityId: number): void {
    this.amenityService.deleteAmenity(amenityId).subscribe({
      next: () => {
        this.amenities = this.amenities.filter(amenity => amenity.id !== amenityId);
        console.log('Amenity deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting amenity:', err);
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedAmenities();
    }
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.maxRowsPerPage < this.amenities.length) {
      this.currentPage++;
      this.updatePaginatedAmenities();
    }
  }

  emptyRows(currentAmenityCount: number): any[] {
    const emptyRowCount = Math.max(0, this.maxRowsPerPage - currentAmenityCount);
    return Array(emptyRowCount);
  }

}
