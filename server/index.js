require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const harperSaveMessage = require("./services/harper-save-message");

app.use(cors());

const server = http.createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const CHAT_BOT = "ChatBot";
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
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // Save the new user to the room
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit("chatroom_users", chatRoomUsers);
        socket.emit("chatroom_users", chatRoomUsers);
    });

    socket.on("send_message", (data) => {
        const { message, username, room, __createdtime__ } = data;
        io.in(room).emit("receive_message", data); // Send to all users in room, including sender
        harperSaveMessage(message, username, room, __createdtime__) // Save message in db
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
    });
});

server.listen(4000, () => console.log("Server is running on port 4000"));
