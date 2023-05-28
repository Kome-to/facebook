let users = [];

const SocketServer = (socket) => {
  console.log("Connected");
  socket.on("joinUser", (user) => {
    console.log("Join =>>", user.id);
    users.push({ user, socketId: socket.id });
  });
  socket.on("disconnect", () => {
    console.log("Disconnect");
    users = [...users.filter((user) => user.socketId !== socket.id)];
  });

  socket.on("sendMessage", ({ user }) => {
    const recipient = users.find((userItem) => userItem.user.id === user);
    const sender = users.find((userItem) => userItem.socketId === socket.id);
    console.log("Sending to", recipient.user);
    if (recipient && sender) {
      socket.to(recipient.socketId).emit("receiveMessage", sender.user.id);
    }
  });
};

module.exports = SocketServer;
