import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth Service] Login Success',
  props<{ id: string }>()
);
export const logout = createAction('[Auth Service] Logout');
