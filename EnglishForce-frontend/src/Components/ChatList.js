import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import axiosInstance from '../Api/axiosInstance';
import Chat from './ChatBox.js';

const ChatList = ({ senderId }) => {
    const [conversations, setConversations] = useState([1,2,3,4,5,6,7]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        // Giả sử API trả về danh sách người dùng đã trò chuyện
        axiosInstance.get(`/conversations/${senderId}`)
            .then(res => setConversations(res.data))
            .catch(err => console.error(err));
    }, [senderId]);

    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: 300, border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Danh sách Chat</Typography>
                <List>
                    {conversations.map((user) => (
                        <ListItem 
                            button 
                            key={user.id} 
                            onClick={() => setSelectedChat(user)}
                        >
                            <ListItemText primary={user.name} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {selectedChat && (
                <Chat senderId={senderId} receiverId={selectedChat.id} />
            )}
        </Box>
    );
};

export default ChatList;
