import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/models/User';
import {
  register,
  loadUsers
} from '../actions/users.actions';

export const initialState = Array<User>();

export const usersReducer = createReducer(
  initialState,
  on(register, (state, { user }) => {
    console.log("Adding user: ", user.id);
    return [...state, user];
  }),
  on(loadUsers, (_, { users }) => {
    console.log("Loading users from the database...");
    return users;
  })
);