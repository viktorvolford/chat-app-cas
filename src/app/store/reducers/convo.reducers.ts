import { createReducer, on } from '@ngrx/store';
import { ConvoType } from '../../shared/models/ConvoType';
import {
    setConvoId,
    setConvoType
} from '../actions/convo.actions';

export const initialState = null;

export const convoTypeReducer = createReducer<ConvoType | null>(
    initialState,
    on(setConvoType, (_, {convoType}) => convoType)
);

export const convoIdReducer = createReducer<string | null>(
    initialState,
    on(setConvoId, (_, {convoId}) => convoId)
);