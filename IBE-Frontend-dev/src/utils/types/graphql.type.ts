export interface GraphqlTypeTs {
    data: Data;
}

export interface Data {
    listRooms: ListRoom[];
}

export interface ListRoom {
    room_id:     number;
    room_number: number;
}
