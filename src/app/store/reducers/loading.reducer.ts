import { createReducer, on } from '@ngrx/store';
import {
    setLoading
} from '../actions/loading.actions';

export const initialState = false;

export const loadingReducer = createReducer(
    initialState,
    on(setLoading, (_, {value}) => value)
);