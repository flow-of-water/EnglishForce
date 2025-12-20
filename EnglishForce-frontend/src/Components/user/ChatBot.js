import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, IconButton, List, ListItem, Typography, Fade } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import axiosInstance from '../../Api/axiosInstance';

const Chatbot = () => {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [open, setOpen] = useState(false);
	const [chatbot, setChatbot] = useState('gemini');
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Auto scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = async () => {
		if (input.trim() === '') return;

		const userMessage = { sender: 'user', text: input };
		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setLoading(true);

		try {
			const endpoint = chatbot === 'gemini' ? '/AI/generate2' : '/AI/chatbot';
			const res = await axiosInstance.post(endpoint, { prompt: input });
			const data = res.data;
			const botMessage = { sender: 'bot', text: renderMessageWithLinks(data) };
			setMessages(prev => [...prev, botMessage]);
		} catch (err) {
			console.error('Error fetching response:', err);
		} finally {
			setLoading(false);
		}
	};

	// 🔗 Detect and style links
	function renderMessageWithLinks(text) {
		const formatted = text.replace(
			/(https?:\/\/[^\s]+)/g,
			url => `<a href="${url}" target="_blank" style="color:#1565c0;">${url}</a>`
		);
		return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
	}

	return (
		<>
			{/* Floating chat button */}
			{!open && (
				<Fade in>
					<IconButton
						onClick={() => setOpen(true)}
						sx={{
							position: 'fixed',
							bottom: 24,
							right: 24,
							background: 'linear-gradient(135deg, #1976d2, #00c6ff)',
							color: 'white',
							width: 50,
							height: 50,
							borderRadius: '50%',
							boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
							transition: 'all 0.3s ease',
							zIndex: 2000,
							'&:hover': {
								transform: 'scale(1.05)',
								boxShadow: '0 10px 24px rgba(25,118,210,0.4)',
							},
						}}
					>
						<ChatIcon fontSize="medium" />
					</IconButton>
				</Fade>
			)}

			{/* Chat window */}
			<Fade in={open}>
				<Box
					sx={{
						position: 'fixed',
						bottom: 24,
						right: 24,
						width: 380,
						height: 520,
						display: 'flex',
						flexDirection: 'column',
						borderRadius: 4,
						boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
						overflow: 'hidden',
						backgroundColor: '#ffffff',
						zIndex: 2000,
						backdropFilter: 'blur(10px)',
					}}
				>
					{/* Header */}
					<Box
						sx={{
							background: 'linear-gradient(to right, #1976d2, #00c6ff)',
							color: 'white',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							px: 2,
							py: 1.5,
						}}
					>
						<Typography fontWeight={700}>EnglishForce Assistant</Typography>
						<IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Chatbot selector */}
					<Box sx={{ px: 2, py: 1 }}>
						<TextField
							select
							SelectProps={{ native: true }}
							value={chatbot}
							onChange={e => setChatbot(e.target.value)}
							variant="outlined"
							size="small"
							sx={{
								width: '100%',
								borderRadius: 2,
								'& .MuiOutlinedInput-root': { borderRadius: 2 },
							}}
						>
							<option value="gemini">Gemini</option>
							<option value="myChatbot">EnglishForceBot</option>
						</TextField>
					</Box>

					{/* Message list */}
					<List
						sx={{
							flex: 1,
							overflowY: 'auto',
							px: 2,
							py: 1,
							display: 'flex',
							flexDirection: 'column',
							backgroundColor: '#f7f9fc',
							scrollBehavior: 'smooth',
						}}
					>
						{messages.map((msg, index) => (
							<ListItem
								key={index}
								sx={{
									display: 'flex',
									justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
									animation: 'fadeIn 0.4s ease',
								}}
							>
								<Box
									sx={{
										maxWidth: '75%',
										p: 1.2,
										borderRadius:
											msg.sender === 'user' ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
										wordWrap: 'break-word',
										background:
											msg.sender === 'user'
												? 'linear-gradient(to right, #1976d2, #00c6ff)'
												: '#e9eef5',
										color: msg.sender === 'user' ? 'white' : 'black',
										fontSize: '0.95rem',
										boxShadow:
											msg.sender === 'user'
												? '0 3px 10px rgba(25,118,210,0.3)'
												: '0 2px 6px rgba(0,0,0,0.05)',
										whiteSpace: 'pre-wrap',
										lineHeight: 1.5,
										'& a': {
											textDecoration: 'underline',
											color: '#1565c0',
										},
									}}
								>
									{msg.text}
								</Box>
							</ListItem>
						))}
						{loading && (
							<ListItem sx={{ justifyContent: 'flex-start' }}>
								<Box
									sx={{
										px: 2,
										py: 1,
										borderRadius: 2,
										backgroundColor: '#e0e0e0',
										fontSize: '0.9rem',
										color: 'text.secondary',
										fontStyle: 'italic',
									}}
								>
									Thinking...
								</Box>
							</ListItem>
						)}
						<div ref={messagesEndRef} />
					</List>

					{/* Input area */}
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							p: 1.5,
							borderTop: '1px solid #e0e0e0',
							backgroundColor: '#fff',
						}}
					>
						<TextField
							fullWidth
							variant="outlined"
							size="small"
							placeholder="Ask something..."
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyPress={e => {
								if (e.key === 'Enter') handleSend();
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 3,
								},
							}}
						/>
						<Button
							variant="contained"
							onClick={handleSend}
							disabled={loading}
							sx={{
								ml: 1.5,
								minWidth: 44,
								height: 44,
								borderRadius: '50%',
								background: 'linear-gradient(to right, #1976d2, #00c6ff)',
								boxShadow: '0 3px 10px rgba(25,118,210,0.3)',
								'&:hover': {
									background: 'linear-gradient(to right, #1565c0, #00bcd4)',
								},
							}}
						>
							🚀
						</Button>
					</Box>
				</Box>
			</Fade>
		</>
	);
};

export default Chatbot;
