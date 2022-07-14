import { createAction, props } from '@ngrx/store';
import { Message } from '../../shared/models/Message';

export const sendMessage = createAction(
    '[Message Service] Message Sent Successfully',
    props<{ message: Message }>()
);

export const editMessage = createAction(
    '[Message Service] Message Edited Successfully',
    props<{ messageId: string, newContent: string }>()
);

export const deleteMessage = createAction(
    '[Message Service] Message Deleted Successfully',
    props<{ messageId: string }>()
);

export const loadMessages = createAction(
    '[Message Service] Loading Messages From Database',
    props<{ messages: Message[] }>()
);