import { Message } from "../../shared/models/Message";
import { ConvoType } from "../../shared/models/ConvoType";
import { Room } from "../../shared/models/Room";
import { RoomType } from "../../shared/models/RoomType";
import { User } from "../../shared/models/User";

export interface AppState {
    userSession: string,
    loading: boolean,
    roomType: RoomType,
    convoType: ConvoType | null,
    convoId: string | null,
    users: User[],
    rooms: Room[],
    messages: Message[]
}
  