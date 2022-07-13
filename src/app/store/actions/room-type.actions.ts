import { createAction, props } from '@ngrx/store';

export const setRoomType = createAction(
    '[Main Component] Room Type Set',
    props<{ roomType: string }>()
);