import { createReducer, on } from '@ngrx/store';
import {
    setConvoId,
    setConvoType
} from '../actions/convo.actions';

export const initialState = '';

export const convoTypeReducer = createReducer(
    initialState,
    on(setConvoType, (_, {convoType}) => {
        console.log("Setting the conversation type...", convoType);
        return convoType;
    })
);

export const convoIdReducer = createReducer(
    initialState,
    on(setConvoId, (_, {convoId}) => {
        console.log("Setting the conversation id...", convoId);
        return convoId;
    })
);