import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import express from 'express';
const AppError = require('../errors/AppError');
const roomController = require('../controllers/room')
const messageController = require('../controllers/message')

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: { [id: string]: string };
    public rooms: {[id: string]: Set<string>}

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.rooms = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });

        this.io.on('connect', this.StartListeners);
    }

    StartListeners = (socket: Socket) => {
        console.info('Message from socket ' + socket.id);

        socket.on('handshake', (userId: string, callback: (userId: string, users: string[]) => void) => {
            console.info('Handshake from socket ' + socket.id);

            console.info('Message coming from user : ' + userId);

            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.info(`User ${userId} has reconnected`);
                // const userId = this.GetUserIDFromSocketId(socket.id);
                const users = Object.values(this.users)

                if (userId) {
                    console.info('Sending callback for reconnect');
                    callback(userId, users);
                    return;
                }
            }

            this.users[userId] = socket.id;

            const users = Object.keys(this.users);
            console.info('Sending callback with users : ' + users);
            callback(userId, users);
        });

        
        socket.on('join', async (data, callback: (message: string) => void) => {
            if (data.roomId === 'main') {
                console.error(data.userId + ' can not join room : main');
                callback('Nobody can join room : main');
                return;
            }
            const isUserInRoom = await roomController.checkIfUserIsInRoom(data.roomId, data.userId)
            if (isUserInRoom) {
                this.rooms[data.roomId] = this.rooms[data.roomId] ? this.rooms[data.roomId].add(data.userId) : new Set<string>().add(data.userId);
                socket.join(data.roomId);
                console.info(data.userId + ' joined room : ' + data.roomId)
                callback('Joined room : ' + data.roomId);
            } else {
                console.error(data.userId + ' can not join room : ' + data.roomId);
                callback('Can not join room : ' + data.roomId);
            }
        })
        
        socket.on('typing', (data) => {
            socket.to(data.roomId).emit('typingResponse', data.userId)
        });
        
        socket.on('message', async (message) => {
            try {
                console.info(`Here are the current users in room ${message.roomId} : ` + [...this.rooms[message.roomId]].join(' '));
                console.info('NUMBER OF USERS IN ROOM IS : ' + this.rooms[message.roomId].size)
                console.info('New message received from user : ' + message.userId + ' with content : ' + message.text);
                const result = await messageController.persistMessageInDatabase(message);
                console.info('sending message to room : ' + message.roomId);
                this.io.to(message.roomId).emit('message', {...message});
            } catch (err: any) {
                console.error(err.message);
            }
        })

        socket.on('leaveRoom', async (data, callback: () => void) => {
            console.info(`User ${data.userId} wants to leave room ${data.roomId}`);
            try {
                const result = await roomController.removeUserFromRoom(data.roomId, data.userId);
                console.log("LEAVE ROOM RESULT : " + result);
                socket.leave(data.roomId);
                this.rooms[data.roomId].delete(data.userId);
                console.info(`Here are the current users in room ${data.roomId} : ` + [...this.rooms[data.roomId]].join(' '));
                callback();
            } catch (err: any) {
                console.error(err.message);
            }
        })

        socket.on('disconnect', () => {
                console.info('Disconnect received from socket : ' + socket.id);

                const userId = this.GetUserIDFromSocketId(socket.id);

                if (userId) {
                    delete this.users[userId];
                }
        })
    }

    GetUserIDFromSocketId = (socketId: string) => {
        return Object.keys(this.users).find(userId => this.users[userId] === socketId);
    };

    SendMessageToListOfUsers = (name: string, users: string[], payload?: Object) => {
        console.info('Emtting event: ' + name + ' to ' + users);
        users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)))
    }

    SendMessageToRoom = (name: string, room: string, payload?: Object) => {
        console.info('Emtting event: ' + name + ' to ' + room);
        payload ? this.io.to(room).emit(name, payload) : this.io.to(room).emit(name);
    }

}

exports.getUsers = async (req: express.Request,
    res: express.Response) => {
    return res.status(200).json({ users: ServerSocket.instance.users })
};