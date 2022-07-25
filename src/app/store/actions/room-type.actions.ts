import { createAction, props } from '@ngrx/store';
import { RoomType } from '../../shared/models/RoomType';

export const setRoomType = createAction(
    '[Main Component] Room Type Set',
    props<{ roomType: RoomType }>()
);