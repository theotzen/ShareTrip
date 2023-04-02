import express from 'express';
const socketController = require('../controllers/socket');

const router = express.Router();

router.get('/users', socketController.getUsers);

module.exports = router;