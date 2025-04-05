import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { io } from "socket.io-client";
import axiosInstance from "../Api/axiosInstance";

const socket = io("http://localhost:5000");

const Chat = ({ senderId, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Lấy tin nhắn khi component được mount
    useEffect(() => {
        axiosInstance.get(`/messages/${senderId}/${receiverId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error(err));

        // Lắng nghe tin nhắn mới từ server
        socket.on("new_message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("new_message");
        };
    }, [senderId, receiverId]);

    // Gửi tin nhắn
    const sendMessage = async () => {
        if (newMessage.trim() === "") return;

        const messageData = {
            senderId: senderId,
            receiverId: receiverId,
            content: newMessage,
        };

        try {
            await axiosInstance.post("/messages", messageData);
            setNewMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <Box sx={{ width: "400px", p: 2, border: "1px solid #ccc", borderRadius: 2,
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 300,
    
         }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Chat</Typography>
            <List sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <ListItem key={index} sx={{ justifyContent: msg.sender_id === senderId ? "flex-end" : "flex-start" }}>
                        <ListItemText
                            primary={msg.content}
                            secondary={new Date(msg.timestamp).toLocaleTimeString()}
                            sx={{
                                backgroundColor: msg.sender_id === senderId ? "#007bff" : "#e0e0e0",
                                color: msg.sender_id === senderId ? "white" : "black",
                                borderRadius: "10px",
                                padding: "8px",
                                maxWidth: "70%",
                            }}
                        />
                    </ListItem>
                ))}
            </List>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{ mt: 2 }}
            />
            <Button fullWidth variant="contained" onClick={sendMessage} sx={{ mt: 1 }}>
                Gửi
            </Button>
        </Box>
    );
};

export default Chat;
