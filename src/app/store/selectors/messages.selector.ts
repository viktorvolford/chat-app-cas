import { AppState } from '../models/app.state';

export const selectMessages = (state: AppState) => state.messages;