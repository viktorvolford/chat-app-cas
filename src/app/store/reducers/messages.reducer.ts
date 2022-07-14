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
    on(sendMessage, (state, { message }) => {
        console.log("Sending message: ", message.content);
        return [...state, message];
    }),
    on(editMessage, (state , { messageId, newContent }) => {
        console.log("Edited message: ", newContent);
        const messages : Message[] = [...state];
        (messages.find(elem => elem.id === messageId) as Message).content = newContent;
        return messages;
    }),
    on(deleteMessage, (state , { messageId }) => {
        console.log("Deleted message: ", messageId);
        const messages : Message[] = state.filter(elem => elem.id !== messageId);
        return messages;
    }),
    on(loadMessages, (_, {messages}) => {
        console.log("Loading messages from database...");
        return messages;
    })
);