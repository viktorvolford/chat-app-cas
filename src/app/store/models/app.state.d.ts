import { Message } from "../../shared/models/Message";
import { Room, RoomType } from "../../shared/models/Room";
import { User } from "../../shared/models/User";

export interface AppState {
    userSession: string,
    loading: boolean,
    roomType: RoomType,
    convoType: string,
    convoId: string,
    users: User[],
    rooms: Room[],
    messages: Message[]
}
  