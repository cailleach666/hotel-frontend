import { Pipe, PipeTransform } from '@angular/core';
import {Room} from "../../../core/models/room";

@Pipe({
  name: 'filterByRoomNumber',
  standalone: true
})
export class FilterByRoomNumberPipe implements PipeTransform {

  transform(rooms: Room[], searchTerm: string): Room[] {
    if (!searchTerm) {
      return rooms;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    return rooms.filter(room =>
      room.roomNumber.toString().toLowerCase().includes(lowerCaseTerm)
    );
  }

}
