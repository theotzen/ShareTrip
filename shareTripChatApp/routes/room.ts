import express from 'express';

const router = express.Router()

const roomController = require('../controllers/room')

router.post('/createRoom', roomController.createRoom)
router.post('/addUserToRoom', roomController.addUserToRoom)
router.get('/getRoomsForUser/:userId', roomController.getRoomsForUser)
router.get('/getRoomById/:roomId', roomController.getRoomById)

module.exports = router
