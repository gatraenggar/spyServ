const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = 3000

io.on("connection", (socket) => {
  console.log("Connected!")
  // ...
});

console.log("Server running on http://localhost:" + port)

httpServer.listen(port);