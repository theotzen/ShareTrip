import { MessagePayload, UserId } from "../schemas/message";
import { TypedRequestBody } from "../utils/expressSchema";
import express from 'express';
const AppError = require('../errors/AppError');
const Message = require('../models/message')
    

exports.createMessage = async (req: TypedRequestBody<MessagePayload>,
        res: express.Response) => {
    try {
        const message = new Message(req.body)
        const result = await message.save();
        res.status(201).json({ message: 'Message created', result})
    }
    catch (err) {
        new AppError(err.message, err.code);
    }
}


exports.getMessageById = async (req: express.Request,
        res: express.Response) => {
    try {
        const message = await Message.findOne({
            _id: req.params.id
        })
        res.status(200).json(message);
    }
    catch (err) {
        new AppError(err.message, err.code);
    }
}


exports.getMessagesByUserId = async (req: express.Request,
        res: express.Response) => {
    try {
        const message = await Message.find({
            userId: req.params.userId
        })
        res.status(200).json(message);
    }
    catch (err) {
        new AppError(err.message, err.code);
    }
}


exports.getMessagesByRoomId = async (req: express.Request,
    res: express.Response) => {
    try {
        const message = await Message.find({
            roomId: req.params.roomId
        })
        res.status(200).json(message);
    }
    catch (err) {
        new AppError(err.message, err.code);
    }
}