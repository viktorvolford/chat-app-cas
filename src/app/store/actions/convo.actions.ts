import { createAction, props } from '@ngrx/store';

export const setConvoType = createAction(
    '[Conversation Component] Conversion Type Set',
    props<{ convoType: string }>()
);

export const setConvoId = createAction(
    '[Conversation Component] Conversion Id Set',
    props<{ convoId: string }>()
);