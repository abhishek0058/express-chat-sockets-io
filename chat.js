const Group = reqiure("./models/group.js");
const Message = reqiure("./models/message.js");

module.exports = (io) => {

  console.log("Inside chat.js");

  io.on("connection", socket => {
    socket.on("message", payload => {
      const { text, sender, receiver, group, key } = payload;
      switch (key) {
        case "JOIN_GROUP":
          const groupId = await Group.findById(group).select("_id").lean();
          if (groupId) socket.join(groupId);
          break;

        case "NEW_MESSAGE":
          const groupId = await Group.findById(group).select("_id").lean();
          if (groupId) {
            const message = { text, sender, receiver, group };
            await Message.create(message);
            const messageForClient = JSON.stringify({ text, sender });
            io.to(groupId).emit(messageForClient);
          }
          break;
        default:
          break;
      }
    });
  });

}