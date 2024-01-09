const socketIO = require("socket.io");

let io;
function initSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
      transports: ["websocket", "polling"],
    },
  });

  return io;
}

module.exports = { initSocket, io };
