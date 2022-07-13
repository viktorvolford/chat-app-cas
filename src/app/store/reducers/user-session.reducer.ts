import { createReducer, on } from '@ngrx/store';
import {
  login,
  logout
} from '../actions/user-session.actions';

export const initialState = '';

export const userSessionReducer = createReducer(
  initialState,
  on(login, (_, { id }) => {
      console.log("Logged in user: ", id);
      return id;
    }),
  on(logout, _ => {
      console.log("Logout has happened!")
      return '';
    })
);