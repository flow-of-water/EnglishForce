import * as Message from "../models/messageModel.js" ;

export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Message.getMessages(senderId, receiverId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy tin nhắn" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const message = await Message.sendMessage(senderId, receiverId, content);

        // Emit tin nhắn đến tất cả client (sử dụng socket)
        req.io.emit('new_message', message);

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi gửi tin nhắn" });
    }
};
