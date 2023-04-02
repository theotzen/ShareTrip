import express from 'express';

const router = express.Router()

const messageController = require('../controllers/message')

router.post('/createMessage', messageController.createMessage)
router.get('/getOneById/:id', messageController.getMessageById)
router.get('/getMessagesByUserId/:userId', messageController.getMessagesByUserId)
router.get('/getMessagesByRoomId/:roomId', messageController.getMessagesByRoomId)

module.exports = router
