import {
  Component,
  OnInit
} from '@angular/core';
import { Room } from "../../../core/models/room";
import { RoomService } from "../../../core/services/roomService/room.service";
import { RoomType } from "../../../core/enums/room-type";
import {
  FormBuilder,
  FormGroup,
  FormsModule, ReactiveFormsModule
} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {FilterByRoomNumberPipe} from "../../../shared/pipes/roomFilter/filter-by-room-number.pipe";
import {SearchCriteria} from "../../../core/models/searchCriteria";

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    ReactiveFormsModule,
    FilterByRoomNumberPipe
  ],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.css'
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  editModes: { [key: number]: boolean } = {};
  searchForm!: FormGroup;
  roomTypes = Object.values(RoomType);
  currentPage: number = 0;
  currentSearchCriteria: SearchCriteria = {};

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.createSearchForm();
    this.fetchRooms();
  }

  createSearchForm() {
    this.searchForm = this.formBuilder.group({
      type: [''],
      minPrice: [''],
      maxPrice: [''],
    });
  }

  fetchRooms(page: number = 0): void {
    const searchParams = { ...this.currentSearchCriteria, page: page };
    this.roomService.searchRooms(searchParams).subscribe({
      next: (data) => {
        this.rooms = data;
        this.rooms.forEach(room => this.editModes[room.id] = false);
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

  clearFilters() {
    this.searchForm.reset({
      type: '',
      minPrice: '',
      maxPrice: '',
    });
    this.currentSearchCriteria = {};
    this.fetchRooms();
  }

  toggleEdit(room: Room): void {
    const isEditing = this.editModes[room.id];

    if (isEditing) {
      this.roomService.updateRoom(room.id, room).subscribe({
        next: () => {
          this.editModes[room.id] = false;
          console.log('Room updated successfully:', room);
        },
        error: (err) => {
          console.error('Error updating room:', err);
        }
      });
    } else {
      this.editModes[room.id] = true;
    }
  }

  deleteRoom(roomId: number): void {
    this.roomService.deleteRoom(roomId).subscribe({
      next: () => {
        this.rooms = this.rooms.filter(room => room.id !== roomId);
        console.log('Room deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting room:', err);
      }
    });
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
