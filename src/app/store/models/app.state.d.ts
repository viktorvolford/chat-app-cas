import { Room } from "../../shared/models/Room";
import { User } from "../../shared/models/User";

export interface AppState {
    userSession: string,
    roomType: string,
    convoType: string,
    convoId: string,
    users: User[],
    rooms: Room[]
}
  