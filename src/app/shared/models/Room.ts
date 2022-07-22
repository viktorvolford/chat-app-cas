export interface Room {
    id: string,
    members: Array<string>,
    name: string,
    owner_id: string,
    type: RoomType,
    password: string
}

export enum RoomType {
    Public,
    Private,
    Protected
};