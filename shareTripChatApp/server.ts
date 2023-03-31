import http from 'http';
import * as socket from "socket.io";
const app_ = require('./app.ts');


const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '9000');
app_.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app_);

const socketIO = new socket.Server(server, {
  cors: {
      origin: "http://localhost:3000"
  }
})

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('newUser', (data) => {
    console.log('new user will be added', data.userId)
    // }
})

  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.disconnect();
  });
});

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);