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
const places = require("./gameSource").places
let placeIndex, spy, spyIndex

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
  });

  socket.on('game-start', () => {
    // return random int between 0 to (length-1)
    placeIndex = Math.floor(Math.random() * places.length);
    spyIndex = Math.floor(Math.random() * userList.length);

    spy = userList[spyIndex].username
    const roles = places[placeIndex].roles

    userList.forEach((user, i) => (
      userList[i] = {
      id: user.id,
      username: user.username,
      role: user.username === spy ? "Spy" : roles[Math.floor(Math.random() * roles.length)],
      place: user.username === spy ? "?" : places[placeIndex].name
    }))

    io.in(room).emit('role-assign', { userList });
  })

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