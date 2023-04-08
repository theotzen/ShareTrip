import express from 'express';
import { RoomPayload, RoomUserId } from '../schemas/room';
import { TypedRequestBody } from '../utils/expressSchema';
const AppError = require('../errors/AppError');
const Room = require('../models/room')
    

exports.createRoom = async (req: TypedRequestBody<RoomPayload>,
        res: express.Response) => {
    try {
        const room = new Room(req.body)
        const result = await room.save();
        res.status(201).json({ message: 'Room created', result})
    }
    catch (err) {
        new AppError(err.message, err.code);
    }
}


exports.getRoomById = async (req: express.Request,
    res: express.Response) => {
    try {
        const result = await Room.find({
            _id: req.params.roomId
        })
        res.status(201).json({ result })
    }
    catch (err) {
        new AppError(err.message, err.code);
    }
}


exports.addUserToRoom = async (req: TypedRequestBody<RoomUserId>,
    res: express.Response) => {
    try {
        const isUserInRoom = await checkIfUserIsInRoom(req.body.roomId, req.body.userId);
        console.info(isUserInRoom);
        if (isUserInRoom) {
            res.status(400).json({ message: 'User already in room'});
            return;
        }
        const result = await Room.updateOne(
            {_id: req.body.roomId},
            { 
                $push: { users: req.body.userId },
                dateUpdated: Date.now()
            }
        )
        res.status(201).json({ message: 'User joined room', result})
    }
    catch (err) {
        new AppError(err.message, err.code);
    } 
}


exports.getRoomsForUser = async (req: express.Request,
    res: express.Response) => {
    try {
        const result = await Room.find({
            users: req.params.userId
        })
        res.status(201).json({ result })
    }
    catch (err) {
        new AppError(err.message, err.code);
    } 
}


export async function checkIfUserIsInRoom(roomId: string, userId: string) {
    try {
        const room = await Room.findOne({
            _id: roomId
        })
        const usersInRoom = room.users;
        if (!(usersInRoom.includes(userId))) {
            return false;
        }
        return true;
    } catch (err) {
        new AppError(err.message, err.code);
    }
}


exports.removeUserFromRoom = async (roomId: string, userId: string) => {
    try {
        const result = await Room.updateOne(
            { _id: roomId },
            { $pull: { users: userId }}
        )
        return result["acknowledged"];
    } catch (err) {
        new AppError(err.message, err.code);
    }
}