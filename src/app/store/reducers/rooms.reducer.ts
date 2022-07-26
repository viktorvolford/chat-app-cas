import { createReducer, on } from '@ngrx/store';
import { Room } from '../../shared/models/Room';
import {
    loadRooms,
    roomCreated
} from '../actions/rooms.actions';

export const initialState : Array<Room> = [];

export const roomsReducer = createReducer(
    initialState,
    on(roomCreated, (state, { room }) => [...state, room]),
    on(loadRooms, (_, { rooms }) => rooms)
);