class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBoxId = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        //Requestion for connection with chat server
        // this.socket = io.connect("http://34.207.154.78:5000");
        this.socket = io.connect("http://localhost:5000");


        if (this.userEmail) {

            this.connectionHandler();

        }

    }

    connectionHandler() {
        let self = this;

        //Requesting for connecting socket to the chat server
        this.socket.on("connect", function () {
            console.log("connection is elstablished using sockets...!");

            //         //Emitting function for joining the chat room
            self.socket.emit("join_room", {
                user_email: self.userEmail,
                chatRoom: "codeial"
            });

            //         //Giving messages to all in that chat room that new user joined
            self.socket.on("user_joined", function (data) {
                console.log("A user joined", data);
            })
        })

        //     //Sending message on click event
        $("#send-message").click(function () {
            let msg = $("#chat-message-input").val();

            if (msg != "") {
                self.socket.emit("send_message", {
                    message: msg,
                    user_email: self.userEmail,
                    chatRoom: "codeial"
                })
            }
            $("#chat-message-input").val("")

        })

        self.socket.on("receive_msg", function (data) {
            console.log("Message Received");
            let newMessage = $("<li>");
            let messageType = "self-message";

            // if(data.userEmail != self.userEmail){
            if (data.user_email != self.userEmail) {

                messageType = "other-message";
            }

            newMessage.append($("<span>", { "html": data.message }));
            newMessage.html(`<span>${data.message}</span>`)
            newMessage.append($("<sub>", { "html": data.user_email }));

            newMessage.addClass(messageType);
            $("#chat-messages-list").append(newMessage);
            console.log(document.getElementById("chat-messages-list"));
        })

    }
}