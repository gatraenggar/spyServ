const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const port = process.env.PORT || 3001;

const room = "spywerk";
const userList = [];

io.on("connection", (socket) => {
  console.log('A user connected with ID: ' + socket.id);

  socket.on('user-join', ({ username }) => {
    userList.push({
      id: socket.id,
      username: username,
    });

    socket.join(room);
    console.log('Total users: ' + userList.length);

    io.in(room).emit('friend-join', userList);

    socket.emit('user-list', userList);
    console.log('user-list emitted');
  });

  socket.on('disconnect', () => {
    const i = userList.findIndex((user) => user.id === socket.id);

    if (i !== -1) {
      let username = userList[i].username;
      userList.splice(i, 1);

      socket.to(room).emit('friend-leave', {
        userList,
        message: username + ' left the game',
      });
    }
  });
});

console.log("Server running on http://localhost:" + port);
httpServer.listen(port);