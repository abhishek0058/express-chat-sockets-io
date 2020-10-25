module.exports = (io) => {

  console.log("Inside chat.js");

  io.on("connection", socket => {

    console.log("----- connection");

    socket.on("message", payload => {
      // new message
    });
    
  });

}