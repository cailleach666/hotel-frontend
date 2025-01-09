import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { NgForOf } from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {Room} from "../../../core/models/room";
import {RoomType} from "../../../core/enums/room-type";
import {RoomService} from "../../../core/services/roomService/room.service";
import {RoomListComponent} from "../room-list/room-list.component";


@Component({
  selector: 'app-room-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RoomListComponent,
    NgForOf,
    FormsModule
  ],
  templateUrl: './room-management.component.html',
  styleUrl: './room-management.component.css'
})
export class RoomManagementComponent implements OnInit {
  rooms: Room[] = [];
  roomTypes = Object.values(RoomType);
  roomForm!: FormGroup;
  multipleRoomsForm!: FormGroup;
  selectedRoomType: string | undefined;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.createMultipleRoomsForm();
  }

  createForm() {
    this.roomForm = this.formBuilder.group({
      roomNumber: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      available: [true],
      type: ['', Validators.required]
    });
  }

  createMultipleRoomsForm() {
    this.multipleRoomsForm = this.formBuilder.group({
      startRoomNumber: ['', [Validators.required]],
      numberOfRooms: [1, [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid) {
      return;
    }

    const newRoom: Room = this.roomForm.value;
    this.roomService.createRoom(newRoom).subscribe({
      next: (room) => {
        console.log('Room created successfully:', room);
        this.roomForm.reset();
      },
      error: (error) => {
        console.error('Error creating room:', error);
      }
    });
  }

  onSubmitCreateMultipleRooms(): void {
    if (this.multipleRoomsForm.invalid) {
      return;
    }

    const { startRoomNumber, numberOfRooms, price, type } = this.multipleRoomsForm.value;

    this.roomService.createMultipleRooms(startRoomNumber, numberOfRooms, price, type).subscribe({
      next: (rooms) => {
        console.log('Multiple rooms created successfully:', rooms);
      },
      error: (error) => {
        console.error('Error creating multiple rooms:', error);
      }
    });
  }

  onSubmitDeleteAllRooms(): void {
    this.roomService.deleteAllRooms().subscribe({
      next: () => {
        console.log('All rooms deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting all rooms:', error);
      }
    });
  }

}
