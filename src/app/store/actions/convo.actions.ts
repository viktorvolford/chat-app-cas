import { createAction, props } from '@ngrx/store';
import { ConvoType } from 'src/app/shared/models/Message';

export const setConvoType = createAction(
    '[Conversation Component] Conversion Type Set',
    props<{ convoType: ConvoType }>()
);

export const setConvoId = createAction(
    '[Conversation Component] Conversion Id Set',
    props<{ convoId: string }>()
);