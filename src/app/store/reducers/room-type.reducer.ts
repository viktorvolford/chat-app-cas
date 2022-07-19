import { createReducer, on } from '@ngrx/store';
import {
    setRoomType
} from '../actions/room-type.actions';

export const initialState = 'public';

export const roomTypeReducer = createReducer(
    initialState,
    on(setRoomType, (_, {roomType}) => roomType)
);