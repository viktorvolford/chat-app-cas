import { createReducer, on } from '@ngrx/store';
import {
    setConvoId,
    setConvoType
} from '../actions/convo.actions';

export const initialState = '';

export const convoTypeReducer = createReducer(
    initialState,
    on(setConvoType, (_, {convoType}) => convoType)
);

export const convoIdReducer = createReducer(
    initialState,
    on(setConvoId, (_, {convoId}) => convoId)
);