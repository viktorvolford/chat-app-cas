import { AppState } from '../models/app.state';

export const selectRooms = (state: AppState) => state.rooms;