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

const userList = [];

io.on("connection", (socket) => {
  console.log('A user connected with ID: ' + socket.id);
  console.log('Total users: ' + userList.length);

  socket.on('user-join', ({ username }) => {
    userList.push({
      id: socket.id,
      username: username,
    });

    socket.emit('user-list', userList);
    console.log('user-list emitted')
  });

});

console.log("Server running on http://localhost:" + port);
httpServer.listen(port);