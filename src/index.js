const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New web socket connection");

  socket.emit("message", "Welcome!!");
  socket.broadcast.emit("message", "A New User has joined");

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if(filter.isProfane(message)) {
        return callback("Profanity is not allowed")
    }
    io.emit("message", message);
    callback();
  });

  socket.on("sendLocation", (location,callback) => {
    io.emit(
      "message",
      `https://maps.google.com?q=${location.latitude},${location.longitude} `
    );
    callback("Location Shared!")
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(port, () => {
  console.log("Server is up at", port);
});