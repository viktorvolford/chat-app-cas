import { AppState } from '../models/app.state';

export const selectUsers = (state: AppState) => state.users;