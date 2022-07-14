import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "../models/app.state";
import { convoTypeReducer } from "./convo.reducers";
import { convoIdReducer } from "./convo.reducers";
import { messagesReducer } from "./messages.reducer";
import { roomTypeReducer } from "./room-type.reducer";
import { roomsReducer } from "./rooms.reducer";
import { userSessionReducer } from "./user-session.reducer";
import { usersReducer } from "./users.reducer";

export const appReducers : ActionReducerMap<AppState> = {
    userSession: userSessionReducer,
    roomType: roomTypeReducer,
    convoType: convoTypeReducer,
    convoId: convoIdReducer,
    users: usersReducer,
    rooms: roomsReducer,
    messages: messagesReducer
}