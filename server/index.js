const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Middleware
app.use(cors());

const server = http.createServer(app);

/* Create an IO server and allow for CORS from 
http://localhost:3000 with GET and POST methds */

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const CHAT_BOT = "ChatBot";

// storing users and chat rooms
let chatRoom = "";
let allUsers = [];

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
    console.log(`User connected successfuly. ID: ${socket.id}.`);

    // Add user to a room
    socket.on("join_room", (data) => {
        // client data
        const { username, room } = data;
        socket.join(room);

        // timestamp (current)
        let __createdtime__ = Date.now();

        // sent message  to all users currently in the room
        socket.to(room).emit("recieve_message", {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // send welcome message to users that joined chat
        socket.emit("recieve_message", {
            message: `Welcome ${username}!`,
            username: CHAT_BOT,
            __createdtime__,
        });

        // Save new user to a room
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit("chatroom_users", chatRoomUsers);
        socket.emit("chatroom_users", chatRoomUsers);
    });
});

server.listen(4000, () => console.log("Server is running on port 3000..."));
