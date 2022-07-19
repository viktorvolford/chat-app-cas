import { createAction, props } from '@ngrx/store';

export const setLoading = createAction(
    '[Loading API] Loading State Changed',
    props<{ value: boolean }>()
);