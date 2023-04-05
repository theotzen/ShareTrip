require("dotenv").config();
import express from 'express';
import mongoose from 'mongoose';
const cookieParser = require('cookie-parser');
const messageRoutes = require('./routes/message')
const healthRoutes = require('./routes/healthcheck')
const socketRoutes = require('./routes/socket')
const roomRoutes = require('./routes/room')
const logRequest = require('./middleware/logRequest')

mongoose.connect(process.env.DATABASE_URL_CHATAPP,
    { 
        connectTimeoutMS: 1000
    }
    )
    .then(() => console.log('Connection to MongoDB succeeded !'))
    .catch((err) => console.log('Connection to MongoDB failed !', err.message));

const app = express();

app.use(cookieParser(`${process.env.JWT_PRIVATE_KEY}`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logRequest);
  

//Origin, X-Requested-With, Content, Accept, Content-Type, Authorization
//GET, POST, PUT, DELETE, PATCH, OPTIONS
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
});

app.use('/api', healthRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/socket', socketRoutes);
app.use('/api/room', roomRoutes);

module.exports = app;
