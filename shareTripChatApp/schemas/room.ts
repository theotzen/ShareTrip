export interface UserId {
    userId: string;
}

export interface RoomId {
    roomId: string;
}

export interface RoomUserId {
    roomId: string;
    userId: string;
}

export interface RoomPayload {
    name: string;
    dateCreated: Date,
    dateUpdated: Date,
    users: string[]
}