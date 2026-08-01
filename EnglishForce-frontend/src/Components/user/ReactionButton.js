import React, { useState } from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axiosInstance from '../../Api/axiosInstance';
import * as Constants from '../../Constants/index.js';

const ReactionButton = ({ reactableType, reactableId, initialCount = 0 }) => {
	const [reacted, setReacted] = useState(null); // null = not yet checked
	const [count, setCount] = useState(initialCount);
	const [loading, setLoading] = useState(false);

	const isLoggedIn = !!localStorage.getItem(Constants.LOCAL_STORAGE.TOKEN);

	const handleClick = async e => {
		e.stopPropagation();
		if (!isLoggedIn || loading) return;

		setLoading(true);
		try {
			let currentReacted = reacted;

			if (currentReacted === null) {
				const { data } = await axiosInstance.get(`/reactions/user/${reactableType}/${reactableId}`);
				currentReacted = !!data;
			}

			if (currentReacted) {
				await axiosInstance.delete('/reactions', {
					data: { reactable_type: reactableType, reactable_id: reactableId },
				});
				setReacted(false);
				setCount(c => Math.max(0, c - 1));
			} else {
				await axiosInstance.post('/reactions', {
					reactable_type: reactableType,
					reactable_id: reactableId,
					reaction_type: 'like',
				});
				setReacted(true);
				setCount(c => c + 1);
			}
		} catch (err) {
			console.error('Reaction error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box display="flex" alignItems="center" gap={0.5} onClick={e => e.stopPropagation()}>
			<IconButton size="small" onClick={handleClick} disabled={!isLoggedIn || loading} sx={{ p: 0.5 }}>
				{loading ? (
					<CircularProgress size={14} />
				) : reacted ? (
					<ThumbUpIcon sx={{ fontSize: 16, color: 'primary.main' }} />
				) : (
					<ThumbUpOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
				)}
			</IconButton>
			<Typography variant="caption" color="text.secondary">
				{count}
			</Typography>
		</Box>
	);
};

export default ReactionButton;
