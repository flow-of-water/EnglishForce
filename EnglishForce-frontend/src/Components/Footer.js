import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Container, Grid, Typography, Link, IconButton, FormControl, Select, MenuItem } from '@mui/material';
import { Facebook, Instagram, Twitter, Language } from '@mui/icons-material';

const LanguageSwitcherDropdown = () => {
	const { t, i18n } = useTranslation();

	const languages = [
		{ code: 'en', name: 'English', flag: '🇬🇧' },
		{ code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
	];

	const handleLanguageChange = event => {
		i18n.changeLanguage(event.target.value);
	};

	return (
		<FormControl
			size="small"
			sx={{
				minWidth: 150,
				'& .MuiOutlinedInput-root': {
					color: 'white',
					'& fieldset': {
						borderColor: 'rgba(255, 255, 255, 0.3)',
					},
					'&:hover fieldset': {
						borderColor: 'rgba(255, 255, 255, 0.5)',
					},
					'&.Mui-focused fieldset': {
						borderColor: 'primary.main',
					},
				},
				'& .MuiSvgIcon-root': {
					color: 'white',
				},
			}}
		>
			<Select value={i18n.language} onChange={handleLanguageChange} displayEmpty>
				{languages.map(language => (
					<MenuItem key={language.code} value={language.code}>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<span>{language.flag}</span>
							<span>{language.name}</span>
						</Box>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default function Footer() {
	const { t } = useTranslation('common');
	const currentYear = new Date().getFullYear();

	return (
		<Box component="footer" sx={{ bgcolor: '#111827', color: 'white', py: 6 }}>
			<Container maxWidth="lg">
				<Grid container spacing={4}>
					<Grid item xs={12} md={3}>
						<Typography variant="h6" gutterBottom>
							EnglishForce
						</Typography>
						<Typography variant="body2" color="gray">
							{t('footer.tagline')}
						</Typography>
					</Grid>

					<Grid item xs={6} md={3}>
						<Typography variant="subtitle1" gutterBottom>
							{t('footer.quickLinks')}
						</Typography>
						<Link href="/" color="inherit" underline="hover" display="block">
							{t('footer.home')}
						</Link>
						<Link href="/courses" color="inherit" underline="hover" display="block">
							{t('footer.courses')}
						</Link>
						<Link href="/exams" color="inherit" underline="hover" display="block">
							{t('footer.exams')}
						</Link>
						<Link href="/about-us" color="inherit" underline="hover" display="block">
							{t('footer.aboutUs')}
						</Link>
					</Grid>

					<Grid item xs={6} md={3}>
						<Typography variant="subtitle1" gutterBottom>
							{t('footer.support')}
						</Typography>
						<Link href="/faq" color="inherit" underline="hover" display="block">
							{t('footer.faq')}
						</Link>
						<Link href="/feedbacks" color="inherit" underline="hover" display="block">
							{t('footer.feedback')}
						</Link>
						<Link href="/contact" color="inherit" underline="hover" display="block">
							{t('footer.contact')}
						</Link>
						<Link href="/terms" color="inherit" underline="hover" display="block">
							{t('footer.terms')}
						</Link>
						<Link href="/privacy" color="inherit" underline="hover" display="block">
							{t('footer.privacy')}
						</Link>
					</Grid>

					<Grid item xs={12} md={3}>
						<Typography variant="subtitle1" gutterBottom>
							{t('footer.followUs')}
						</Typography>
						<Box mt={1}>
							<IconButton href="#" sx={{ color: 'white' }}>
								<Facebook />
							</IconButton>
							<IconButton href="#" sx={{ color: 'white' }}>
								<Instagram />
							</IconButton>
							<IconButton href="#" sx={{ color: 'white' }}>
								<Twitter />
							</IconButton>
						</Box>

						<Box mt={2}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
								<Language sx={{ mr: 1, fontSize: 18 }} />
								<Typography variant="subtitle2">{t('footer.language')}</Typography>
							</Box>
							<LanguageSwitcherDropdown />
						</Box>
					</Grid>
				</Grid>

				<Box mt={5} textAlign="center" borderTop={1} borderColor="gray" pt={3}>
					<Typography variant="body2" color="gray">
						{t('footer.copyright', { year: currentYear })}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
