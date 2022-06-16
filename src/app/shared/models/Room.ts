export interface Room {
    id: string,
    members: Array<string>,
    name: string,
    owner_id: string,
    visibility: string,
    password: string
}