import {RoomType} from "../enums/room-type";

export interface SearchCriteria {
    minPrice?: number;
    maxPrice?: number;
    checkInDate?: string;
    checkOutDate?: string;
    page?: number;
    type?: RoomType;
}
