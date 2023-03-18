// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

let players = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  if (Object.keys(players).length < 2) {
    players[socket.id] = { id: Object.keys(players).length + 1 };
    socket.emit('player', players[socket.id]);
  }

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete players[socket.id];
  });

  socket.on('movement', (data) => {
    players[socket.id].movement = data;
    io.sockets.emit('state', players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
