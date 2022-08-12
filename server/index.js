require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
const leaveRoom = require("./utils/leave-room");

app.use(cors());

const server = http.createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const CHAT_BOT = `CHAT_BOT 🤖`;
let chatRoom = "";
let allUsers = [];
// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on("join_room", (data) => {
        // Data sent from client when join_room event emitted
        const { username, room } = data;
        socket.join(room); // Join the user to a socket room

        // Current timestamp
        let __createdtime__ = Date.now();
        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit("receive_message", {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // Send welcome msg to user that just joined chat only
        socket.emit("receive_message", {
            message: `Welcome ${username} !`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // Save the new user to the room
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit("chatroom_users", chatRoomUsers);
        socket.emit("chatroom_users", chatRoomUsers);

        // get 100   last messages and sent in cahat room
        harperGetMessages(room)
            .then((last100Messages) => {
                socket.emit("last_100_messages", last100Messages);
            })
            .catch((err) => console.log(err));
    });

    socket.on("send_message", (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit("receive_message", data);
        harperSaveMessage(message, username, room, __createdtime__)
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
    });

    socket.on("leave_room", (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit("chatroom_users", allUsers);
        socket.to(room).emit("receive_message", {
            username: CHAT_BOT,
            message: `${username} has left the chat`,
            __createdtime__,
        });
        console.log(`${username} has left the chat`);
    });

    // disconnect event listener from server
    socket.on("disconnect", () => {
        console.log("User desconnected fro the chat.");
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.username) {
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatRoom).emit("chatroom_users", allUsers);
            socket.to(chatRoom).emit("receive_message", {
                message: `${user.username} has disconnected from the chart.`,
            });
        }
    });
});

server.listen(4000, () => console.log("Server is running on port 4000"));
