export interface UserId {
    userId: string;
}

export interface MessagePayload {
    userId: String,
    roomId: String,
    content: String,
    dateSent: Date
}