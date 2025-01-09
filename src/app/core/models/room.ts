import {RoomType} from "../enums/room-type";
import {Amenity} from "./amenity";

export interface Room {
  id: number;
  roomNumber: string;
  price: number;
  available: boolean;
  type: RoomType;
  description?: string | null;
  amenities?: Amenity[];
}
