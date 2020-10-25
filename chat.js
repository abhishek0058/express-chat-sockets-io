const Group = reqiure("./models/group.js");
const Message = reqiure("./models/message.js");

module.exports = (io) => {

  console.log("Inside chat.js");

  io.on("connection", socket => {
    socket.on("message", payload => {
      const { text, sender, receiver, group, key } = payload;
      switch (key) {
        case "JOIN_GROUP":
          socket.join(receiver);
          // client will provide the room it want to join
          const groupId = await Group.findById(group).select("_id").lean();
          if (groupId) socket.join(groupId);
          break;

        case "NEW_MESSAGE":
          // send next message in the group
          const message = { text, sender, receiver, group };
          await Message.create(message);
          const messageForClient = JSON.stringify({ text, sender });
          
          const groupId = await Group.findById(group).select("_id").lean();
          if (groupId) {
            io.to(groupId).emit(messageForClient);
          }
          else {
            io.to(receiver).emit(messageForClient);
          }
          break;
        default:
          break;
      }
    });
  });

}