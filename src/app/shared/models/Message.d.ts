import { ConvoType } from "./ConvoType";

export interface Message {
    id: string,
    date: number,
    content: string,
    sender_id: string,
    target_id: string,
    type: ConvoType
}