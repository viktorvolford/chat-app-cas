export interface Message {
    id: string,
    date: number,
    content: string,
    sender_id: string,
    receiver_id: string,
    room_id: string
}