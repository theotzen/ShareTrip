import mongoose from 'mongoose'
import { v4 as uuid } from 'uuid'

const Schema = mongoose.Schema

const messageSchema = new Schema({
    // messageId: { type: String, required: true, default: () => {
    //      return uuid();
    //  }},
    userId: { type: String, required: true },
    roomId: { type: String, required: true },
    content: { type: String, required: true },
    dateSent: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', messageSchema)
