import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/models/User';
import {
  createUserSuccess,
  loadUsers
} from '../actions/users.actions';

export const initialState = Array<User>();

export const usersReducer = createReducer(
  initialState,
  on(createUserSuccess, (state, { user }) => [...state, user]),
  on(loadUsers, (_, { users }) => users)
);