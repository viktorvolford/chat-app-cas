import { createReducer, on } from '@ngrx/store';
import {
    setRoomType
} from '../actions/room-type.actions';

export const initialState = '';

export const roomTypeReducer = createReducer(
    initialState,
    on(setRoomType, (_, {roomType}) => {
        console.log("Setting the room type...");
        return roomType;
    })
);