import { createReducer, on } from '@ngrx/store';
import { Room } from '../../shared/models/Room';
import {
    loadRooms,
    roomCreated
} from '../actions/rooms.actions';

export const initialState = Array<Room>();

export const roomsReducer = createReducer(
    initialState,
    on(roomCreated, (state, { room }) => {
        console.log("Adding room: ", room.id);
        return [...state, room];
    }),
    on(loadRooms, (_, { rooms }) => {
        console.log("Loading rooms from the database...", rooms);
        return rooms;
    })
);