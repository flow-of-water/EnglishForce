import React, { useState, useEffect, useContext } from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Badge,
	Avatar,
	Tooltip,
	Slide,
	useScrollTrigger,
	useMediaQuery,
	useTheme,
	Drawer,
	Divider,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Link } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import * as Constants from './../../Constants/index.js';
import axiosInstance from '../../Api/axiosInstance.js';
import { useTranslation } from 'react-i18next';

function UserComponent(isLoggedIn, username, handleLogout, navLinkStyle, t) {
	return isLoggedIn ? (
		<>
			<Tooltip title={`Hello, ${username}!`}>
				<Avatar
					sx={{
						bgcolor: '#1976d2',
						width: 36,
						height: 36,
						fontSize: '1rem',
						boxShadow: '0 0 8px #1976d2',
						animation: 'pulse 2s infinite',
						'@keyframes pulse': {
							'0%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.6)' },
							'70%': { boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)' },
							'100%': { boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)' },
						},
						cursor: 'pointer',
					}}
					component={Link}
					to="/profile"
				>
					{username.charAt(0).toUpperCase()}
				</Avatar>
			</Tooltip>

			<Button onClick={handleLogout} sx={navLinkStyle}>
				{t('nav.logout')}
			</Button>
		</>
	) : (
		<>
			<Button component={Link} to="/login" sx={navLinkStyle}>
				{t('nav.login')}
			</Button>
			<Button component={Link} to="/register" sx={navLinkStyle}>
				{t('nav.register')}
			</Button>
		</>
	);
}

function HideOnScroll({ children }) {
	const trigger = useScrollTrigger();
	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

export default function Header() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState('');
	const [role, setRole] = useState('');
	const { cartItems } = useContext(CartContext);

	const [mobileOpen, setMobileOpen] = useState(false);
	const [moreAnchorEl, setMoreAnchorEl] = useState(null);
	const moreOpen = Boolean(moreAnchorEl);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const { t } = useTranslation('common');

	useEffect(() => {
		const token = localStorage.getItem(Constants.LOCAL_STORAGE.TOKEN);
		const storedUsername = localStorage.getItem(Constants.LOCAL_STORAGE.USERNAME);
		const storedRole = localStorage.getItem(Constants.LOCAL_STORAGE.USER_ROLE);

		if (token && storedUsername) {
			setIsLoggedIn(true);
			setUsername(storedUsername);
			setRole(storedRole);
		}
	}, []);

	const handleLogout = async () => {
		try {
			await axiosInstance.post('/auth/logout');
		} catch (error) {
			console.error('Error during logout:', error);
		} finally {
			localStorage.removeItem(Constants.LOCAL_STORAGE.TOKEN);
			localStorage.removeItem(Constants.LOCAL_STORAGE.USERNAME);
			localStorage.removeItem(Constants.LOCAL_STORAGE.USER_ROLE);
			setIsLoggedIn(false);
			setUsername('');
			setRole('');
			window.location.href = '/';
		}
	};

	const handleMoreClick = event => {
		setMoreAnchorEl(event.currentTarget);
	};

	const handleMoreClose = () => {
		setMoreAnchorEl(null);
	};

	const navLinkStyle = {
		color: 'white',
		position: 'relative',
		textTransform: 'uppercase',
		fontWeight: 600,
		'&::after': {
			content: '""',
			position: 'absolute',
			width: 0,
			height: '2px',
			bottom: 0,
			left: '50%',
			backgroundColor: 'cyan',
			transition: 'all 0.3s ease-in-out',
		},
		'&:hover::after': {
			left: 0,
			width: '100%',
		},
		'&:hover': {
			color: 'cyan',
			transform: 'scale(1.05)',
		},
	};

	return (
		<HideOnScroll>
			<AppBar
				position="sticky"
				elevation={10}
				sx={{
					background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
					backdropFilter: 'blur(20px)',
					borderBottom: '1px solid rgba(255,255,255,0.1)',
					zIndex: 1000,
				}}
			>
				<Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
					<Box display="flex" alignItems="center" gap={1}>
						<RocketLaunchIcon fontSize="large" sx={{ color: 'cyan' }} />
						<Typography
							variant="h5"
							component={Link}
							to="/"
							sx={{
								textDecoration: 'none',
								color: '#fff',
								fontWeight: 900,
								fontFamily: 'monospace',
								textShadow: '0 0 10px cyan, 0 0 20px cyan',
								transition: 'transform 0.3s',
								'&:hover': { transform: 'scale(1.1)' },
								caretColor: 'transparent',
							}}
						>
							EnglishForce
						</Typography>
					</Box>
					{isMobile ? (
						<>
							<IconButton color="inherit" onClick={() => setMobileOpen(true)}>
								<MenuIcon />
							</IconButton>
							<Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
								<Box
									sx={{
										width: 240,
										bgcolor: '#0f2027',
										height: '100%',
										px: 2,
										py: 4,
										display: 'flex',
										flexDirection: 'column',
										gap: 2,
										overflow: 'auto',
									}}
									onClick={() => setMobileOpen(false)}
								>
									{role === 'admin' && (
										<Button
											component={Link}
											to="/admin"
											fullWidth
											sx={navLinkStyle}
											startIcon={<AdminPanelSettingsIcon />}
										>
											{t('nav.admin')}
										</Button>
									)}
									<Button component={Link} to="/programs" fullWidth sx={navLinkStyle}>
										{t('nav.programs')}
									</Button>
									<Button component={Link} to="/exams" fullWidth sx={navLinkStyle}>
										{t('nav.exams')}
									</Button>
									<Button component={Link} to="/courses" fullWidth sx={navLinkStyle}>
										{t('nav.courses')}
									</Button>

									{isLoggedIn && (
										<>
											<Button component={Link} to="/courses-user" fullWidth sx={navLinkStyle}>
												{t('nav.myLearning')}
											</Button>

											<IconButton
												component={Link}
												to="/cart"
												sx={{ color: 'white', '&:hover': { color: 'lime' } }}
											>
												<Badge badgeContent={cartItems.length} color="error">
													<ShoppingCartIcon />
												</Badge>
											</IconButton>
										</>
									)}

									<Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
									<Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', px: 1 }}>
										{t('nav.more')}
									</Typography>
									<Button component={Link} to="/blogs" fullWidth sx={navLinkStyle}>
										{t('nav.blog')}
									</Button>
									<Button component={Link} to="/about-us" fullWidth sx={navLinkStyle}>
										{t('footer.aboutUs')}
									</Button>
									<Button component={Link} to="/faq" fullWidth sx={navLinkStyle}>
										{t('footer.faq')}
									</Button>
									<Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.2)' }} />

									<Box sx={{ mt: 'auto' }}>
										{UserComponent(isLoggedIn, username, handleLogout, navLinkStyle, t)}
									</Box>
								</Box>
							</Drawer>
						</>
					) : (
						<Box display="flex" alignItems="center" gap={2}>
							{role === 'admin' && (
								<Button
									component={Link}
									to="/admin"
									startIcon={<AdminPanelSettingsIcon />}
									sx={navLinkStyle}
								>
									{t('nav.admin')}
								</Button>
							)}
							<Button component={Link} to="/programs" sx={navLinkStyle}>
								{t('nav.programs')}
							</Button>
							<Button component={Link} to="/exams" sx={navLinkStyle}>
								{t('nav.exams')}
							</Button>
							<Button component={Link} to="/courses" sx={navLinkStyle}>
								{t('nav.courses')}
							</Button>

							{isLoggedIn && (
								<>
									<Button component={Link} to="/courses-user" sx={navLinkStyle}>
										{t('nav.myLearning')}
									</Button>

									<IconButton
										component={Link}
										to="/cart"
										sx={{ color: 'white', '&:hover': { color: 'lime' } }}
									>
										<Badge badgeContent={cartItems.length} color="error">
											<ShoppingCartIcon />
										</Badge>
									</IconButton>
								</>
							)}

							<Button
								onClick={handleMoreClick}
								endIcon={<ExpandMoreIcon />}
								sx={{
									...navLinkStyle,
									transform: moreOpen ? 'scale(1.05)' : 'scale(1)',
									color: moreOpen ? 'cyan' : 'white',
								}}
							>
								{t('nav.more')}
							</Button>
							<Menu
								anchorEl={moreAnchorEl}
								open={moreOpen}
								onClose={handleMoreClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								PaperProps={{
									sx: {
										mt: 1.5,
										bgcolor: '#0f2027',
										border: '1px solid rgba(0, 255, 255, 0.2)',
										minWidth: 180,
										'& .MuiMenuItem-root': {
											color: 'white',
											'&:hover': {
												bgcolor: 'rgba(0, 255, 255, 0.1)',
												color: 'cyan',
											},
										},
									},
								}}
							>
								<MenuItem component={Link} to="/blogs" onClick={handleMoreClose}>
									<ListItemText>{t('nav.blog')}</ListItemText>
								</MenuItem>

								<MenuItem component={Link} to="/about-us" onClick={handleMoreClose}>
									<ListItemText>{t('footer.aboutUs')}</ListItemText>
								</MenuItem>
								<MenuItem component={Link} to="/faq" onClick={handleMoreClose}>
									<ListItemText>{t('footer.faq')}</ListItemText>
								</MenuItem>

								<MenuItem component={Link} to="/feedbacks" onClick={handleMoreClose}>
									<ListItemText>{t('nav.feedback')}</ListItemText>
								</MenuItem>
							</Menu>

							{UserComponent(isLoggedIn, username, handleLogout, navLinkStyle, t)}
						</Box>
					)}
				</Toolbar>
			</AppBar>
		</HideOnScroll>
	);
}
