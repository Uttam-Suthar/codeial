module.exports.chatSockets = function (socketServer) {

    //Requiring socket.io for chat engine
    let io = require("socket.io")(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"]
        }
    });


    //Recieving request for connecting socket and acknowledging the connection
    io.sockets.on("connection", function (socket) {
        console.log("new connection recieved", socket.id);

        socket.on("disconnect", function () {
            console.log("Socket disconnected");
        })

        //Receiving request for joining
        socket.on("join_room", function (data) {
            console.log("Joining request received", data);

            //     //Joined the user to the chat room
            socket.join(data.chatRoom);

            //     //Acknowledging all members in the that chat room that new user joined
            io.in(data.chatRoom).emit("user_joined", data);
        })

        //Emitting receive messsage event when handled send message
        socket.on("send_message", function (data) {
            console.log("Send message request received");
            io.in(data.chatRoom).emit("receive_msg", data);
        })

    })

}