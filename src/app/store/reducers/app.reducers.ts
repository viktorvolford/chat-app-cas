import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "../models/app.state";
import { userSessionReducer } from "./user-session.reducer";

export const appReducers : ActionReducerMap<AppState> = {
    userSession: userSessionReducer
}