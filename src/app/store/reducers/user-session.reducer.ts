import { createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  logout
} from '../actions/user-session.actions';

export const initialState = '';

export const userSessionReducer = createReducer(
  initialState,
  on(loginSuccess, (_, { id }) =>  id),
  on(logout, _ => '')
);