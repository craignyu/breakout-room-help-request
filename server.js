'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 4000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

// persistent room data
let rooms = {};
for (let i = 1; i <= 45; i++) {
  rooms[`room${(''+i).padStart(2, '0')}`] = false;
}
console.log(rooms);

io.on('connection', (socket) => {
  console.log('Client connected');

  // immediately send the client the current room status
  let jsonRooms = JSON.stringify(rooms);
  socket.emit('roomupdate', jsonRooms);

  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('roomchange', function(data) {
    console.log("room change:", data);
    rooms[data] = !rooms[data];
    let jsonRooms = JSON.stringify(rooms);
    io.emit('roomupdate', jsonRooms);
  });
});
