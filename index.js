const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3001;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const User = require("./events/User")
const Game = require("./events/Game")
const Connection = require("./events/Connection")

const room = "spywerk";
const userList = [];
const places = require("./gameSource").places

io.on("connection", (socket) => {
  const user = new User(socket, io, userList)
  const game = new Game(socket, io, userList, places)
  const connection = new Connection(socket, io, userList)
  
  console.log('A user connected with ID: ' + socket.id);
  
  user.join(room)
  game.start(room)
  connection.disconnect(room)
});

console.log("Server running on http://localhost:" + port);
httpServer.listen(port);