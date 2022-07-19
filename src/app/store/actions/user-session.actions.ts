import { createAction, props } from '@ngrx/store';

export const loginWithEmailPassword = createAction(
  '[Auth API] Login With Email & Password',
  props<{email: string | undefined | null , password: string | undefined | null}>()
);

export const loginWithGoogle = createAction('[Auth API] Login With Google');

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ id: string }>()
);

export const loginFailed = createAction('[Auth API] Login Failed');

export const logout = createAction('[Auth API] Logout');
