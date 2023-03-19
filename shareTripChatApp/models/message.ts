import mongoose from 'mongoose'

const Schema = mongoose.Schema

const messageSchema = new Schema({
    userId: { type: String, required: true },
    socketId: { type: String, required: true },
    content: { type: String, required: true },
    dateSent: { type: Date, default: Date.now },
    messageId: { type: String, required: true, default: () => {
         return Math.random().toString(36)
     }}
})

module.exports = mongoose.model('Message', messageSchema)
