const { Server } = require("socket.io");

let io;

const userSocketMap = new Map(); // userId -> socketId

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("register_user", (userId) => {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on("disconnect", () => {
        // Find and remove disconnected socket from map
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (socketId === socket.id) {
            userSocketMap.delete(userId);
            console.log(`User ${userId} disconnected`);
            break;
          }
        }
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },

  getUserSocket: (userId) => {
    return userSocketMap.get(userId?.toString());
  }
};
