import React from 'react';
import {
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	Divider,
	Toolbar,
	Typography,
	Box,
	ListItemIcon,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const drawerWidth = 240;

const CourseSidebar = ({ sections, mobileOpen, handleDrawerToggle, handleClickItem }) => {
	const drawer = (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				background: 'linear-gradient(to bottom, #f7faff, #ffffff)',
			}}
		>
			{/* Header */}
			<Toolbar sx={{ px: 2 }}>
				<Typography
					variant="h6"
					fontWeight={800}
					sx={{
						background: 'linear-gradient(to right, #1976d2, #00c6ff)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
					}}
				>
					Course Sections
				</Typography>
			</Toolbar>
			<Divider />

			{/* List */}
			<List sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
				{/* Show all */}
				<ListItemButton
					onClick={() => handleClickItem(null)}
					sx={{
						borderRadius: 2,
						mx: 1,
						my: 0.5,
						transition: 'all 0.2s ease',
						'&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' },
					}}
				>
					<ListItemIcon sx={{ minWidth: 40 }}>
						<LibraryBooksIcon color="primary" />
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography variant="body1" fontWeight={300}>
								Show All Course Content
							</Typography>
						}
					/>
				</ListItemButton>

				{/* Section items */}
				{sections.map((section, index) => (
					<ListItemButton
						key={section.public_id || index}
						onClick={() => handleClickItem(section)}
						sx={{
							borderRadius: 2,
							mx: 1,
							my: 0.3,
							transition: 'all 0.25s ease',
							'&:hover': { backgroundColor: 'rgba(25,118,210,0.08)' },
						}}
					>
						<ListItemIcon sx={{ minWidth: 40 }}>
							<PlaylistPlayIcon sx={{ color: '#1976d2' }} />
						</ListItemIcon>
						<ListItemText
							primary={
								<Typography
									variant="body2"
									sx={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										fontWeight: 500,
									}}
								>
									{section.name}
								</Typography>
							}
						/>
					</ListItemButton>
				))}
			</List>

			<Divider />
			<Box sx={{ p: 2, textAlign: 'center' }}>
				<Typography variant="caption" color="text.secondary">
					📘 Keep learning!
				</Typography>
			</Box>
		</Box>
	);

	return (
		<nav aria-label="course sections">
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{ keepMounted: true }}
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
						borderTopLeftRadius: 12,
						borderBottomLeftRadius: 12,
						boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
					},
				}}
			>
				{drawer}
			</Drawer>
		</nav>
	);
};

export default CourseSidebar;
