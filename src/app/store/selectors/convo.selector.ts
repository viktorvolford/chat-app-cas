import { AppState } from '../models/app.state';

export const selectConvoType = (state: AppState) => state.convoType;

export const selectConvoId = (state: AppState) => state.convoId;