import express from 'express';

const router = express.Router()

const messageController = require('../controllers/message')

router.post('/createMessage', messageController.createMessage)
router.get('/getMessageById/:id', messageController.getMessageById)
router.get('/getMessagesByUserId/:userId', messageController.getMessagesByUserId)
router.get('/getMessagesByRoomId/:roomId', messageController.getMessagesByRoomId)
router.get('/getAllMessages', messageController.getAllMessages)
router.delete('/deleteMessageById/:id', messageController.deleteMessageById)
router.delete('/deleteAllMessagesFromUser/:userId', messageController.deleteMessagesByUserId)
router.delete('/deleteAllMessagesFromRoom/:roomId', messageController.deleteMessagesByRoomId)

module.exports = router
