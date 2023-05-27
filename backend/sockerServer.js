let users = [];

const SocketServer = (socket) => {
  console.log(socket.id);
  socket.on("joinUser", (user) => {
    console.log("Join =>>", user);
    users.push({ id: user, socketId: socket.id });
  });
  socket.on("disconnect", () => {
    users = [...users.filter((user) => user.socketId !== socket.id)];
  });
};

module.exports = SocketServer;
