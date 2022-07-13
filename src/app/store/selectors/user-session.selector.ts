import { AppState } from '../models/app.state';

export const selectUserSession = (state: AppState) => state.userSession;