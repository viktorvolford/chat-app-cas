import { createReducer, on } from '@ngrx/store';
import { RoomType } from '../../shared/models/RoomType';
import {
    setRoomType
} from '../actions/room-type.actions';

export const initialState = RoomType.Public;

export const roomTypeReducer = createReducer(
    initialState,
    on(setRoomType, (_, {roomType}) => roomType)
);