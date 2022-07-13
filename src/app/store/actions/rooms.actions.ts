import { createAction, props } from '@ngrx/store';
import { Room } from '../../shared/models/Room';

export const roomCreated = createAction(
    '[Room Service] Room Creation Success',
    props<{ room: Room }>()
);

export const loadRooms = createAction(
    '[Room Service] Loading Rooms From Database',
    props<{ rooms: Room[] }>()
);