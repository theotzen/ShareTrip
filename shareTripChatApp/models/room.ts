import mongoose from 'mongoose'
import { v4 as uuid } from 'uuid'

const Schema = mongoose.Schema

const roomSchema = new Schema({
    // roomId: { type: String, required: true, unique: true, default: () => {
    //      return uuid();
    //  }},
    name: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
    users: {type: [String], required: true, default: []}
})

module.exports = mongoose.model('Room', roomSchema)
