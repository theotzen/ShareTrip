import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';
import express from 'express';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public users: { [id: string]: string };

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
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
        console.info('Message from ' + socket.id);

        socket.on('handshake', (callback: (id: string, users: string[]) => void) => {
            console.info('Handshake from' + socket.id);

            const reconnected = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                console.info(`User ${socket.data.userId} has reconnected`);
                const userId = this.GetUserIDFromSocketId(socket.id);
                const users = Object.values(this.users)

                if (userId) {
                    console.info('Sending callback for reconnect');
                    callback(userId, users);
                    return;
                }
            }

            this.users[socket.data.userId] = socket.id;

            const users = Object.values(this.users);
            console.info('Sending callback');
            callback(socket.data.userId, users);
        })

        socket.on('disconnect', () => {
                console.info('Disconnect received from socket: ' + socket.id);

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