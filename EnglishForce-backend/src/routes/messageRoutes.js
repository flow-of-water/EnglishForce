import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { Server } from "socket.io";

const router = express.Router();

// Tạo instance của Socket.io
let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

// Middleware để truyền io vào req
router.use((req, res, next) => {
    req.io = io;
    next();
});

// Lấy danh sách tin nhắn
router.get("/:senderId/:receiverId", getMessages);

// Gửi tin nhắn + phát sự kiện realtime qua Socket.io
router.post("/", (req, res) => {
    sendMessage(req, res, req.io);
});

export default router;
