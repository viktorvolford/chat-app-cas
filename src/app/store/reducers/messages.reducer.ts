import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { Message } from '../../shared/models/Message';
import {
    sendMessage,
    editMessage,
    deleteMessage,
    loadMessages
} from '../actions/messages.actions';

export const initialState = Array<Message>();

export const messagesReducer = createReducer(
    initialState,
    on(sendMessage, (state, { message }) => [...state, message]),
    on(editMessage, (state , { messageId, newContent }) => {
        const messages : Message[] = [...state];
        (messages.find(elem => elem.id === messageId) as Message).content = newContent;
        return messages;
    }),
    on(deleteMessage, (state , { messageId }) => state.filter(elem => elem.id !== messageId)),
    on(loadMessages, (_, {messages}) => messages)
);