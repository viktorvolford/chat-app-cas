import { AppState } from '../models/app.state';

export const selectLoading = (state: AppState) => state.loading;