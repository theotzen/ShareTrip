
export interface CreateUserSchema {
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  password: string;
  passwordConfirm: string;
}
export interface LoginUserSchema {
  email: string;
  password: string;
}
export interface UserBaseSchema {
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}
export interface UserResponse {
  user: UserResponseSchema;
}
export interface UserResponseSchema {
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  id: string;
}
export interface Message {
  text: string,
  name: string,
  userId: string,
  _id?: string,
  roomId: string,
  dateSent?: Date
}
export interface Room {
  name: string,
  users: string[],
  _id: string,
  dateCreated: Date,
  dateUpdated: Date
}
export interface RoomWithLastMessage {
  name: string,
  users: string[],
  _id: string,
  dateCreated: Date,
  dateUpdated: Date
  lastMessageDate: Date;
}