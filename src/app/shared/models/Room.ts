export interface Room {
    id: string,
    access: Array<string>,
    name: string,
    owner_id: string,
    visibility: string,
    password: string
}