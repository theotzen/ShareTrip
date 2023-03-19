export interface UserId {
    userId: string;
}

export interface MessagePayload {
    userId: String,
    socketId: String,
    content: String,
    dateSent: Date
}