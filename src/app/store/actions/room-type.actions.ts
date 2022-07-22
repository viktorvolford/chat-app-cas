import { createAction, props } from '@ngrx/store';
import { RoomType } from 'src/app/shared/models/Room';

export const setRoomType = createAction(
    '[Main Component] Room Type Set',
    props<{ roomType: RoomType }>()
);