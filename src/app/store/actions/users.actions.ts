import { UserCredential } from '@angular/fire/auth';
import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/User';

export const createUser = createAction(
  '[User Service] Creating User In Process...',
  props<{ user: User, cred: UserCredential }>()
);

export const createUserSuccess = createAction(
  '[User Service] User Created Successfully',
  props<{user: User}>()
);

export const loadUsers = createAction(
  '[User Service] Loading Users From Database',
  props<{ users: User[] }>()
);
