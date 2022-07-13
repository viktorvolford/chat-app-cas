import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/User';

export const register = createAction(
  '[Auth Service] Registration Success',
  props<{ user: User }>()
);

export const loadUsers = createAction(
  '[User Service] Loading Users From Database',
  props<{ users: User[] }>()
);
