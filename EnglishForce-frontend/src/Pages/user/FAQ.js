// Pages/user/FAQ.jsx
import React, { useState } from 'react';
import {
	Container,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	TextField,
	InputAdornment,
	Paper,
	Chip,
	Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import GradientTitle from '../../Components/GradientTitle';

const FAQ = () => {
	const { t } = useTranslation('unimportant');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');

	const categories = [
		{ id: 'all', label: t('faq.categories.all') },
		{ id: 'general', label: t('faq.categories.general') },
		{ id: 'courses', label: t('faq.categories.courses') },
		{ id: 'exams', label: t('faq.categories.exams') },
		{ id: 'programs', label: t('faq.categories.programs') },
		{ id: 'account', label: t('faq.categories.account') },
		{ id: 'technical', label: t('faq.categories.technical') },
		{ id: 'ai', label: t('faq.categories.ai') },
	];

	const faqs = [
		// General
		{
			category: 'general',
			question: t('faq.questions.general.whatIsEnglishForce.question'),
			answer: t('faq.questions.general.whatIsEnglishForce.answer'),
		},
		{
			category: 'general',
			question: t('faq.questions.general.whoIsItFor.question'),
			answer: t('faq.questions.general.whoIsItFor.answer'),
		},
		{
			category: 'general',
			question: t('faq.questions.general.howToGetStarted.question'),
			answer: t('faq.questions.general.howToGetStarted.answer'),
		},

		// Courses
		{
			category: 'courses',
			question: t('faq.questions.courses.howToPurchase.question'),
			answer: t('faq.questions.courses.howToPurchase.answer'),
		},
		{
			category: 'courses',
			question: t('faq.questions.courses.refundPolicy.question'),
			answer: t('faq.questions.courses.refundPolicy.answer'),
		},
		{
			category: 'courses',
			question: t('faq.questions.courses.courseAccess.question'),
			answer: t('faq.questions.courses.courseAccess.answer'),
		},
		{
			category: 'courses',
			question: t('faq.questions.courses.certificate.question'),
			answer: t('faq.questions.courses.certificate.answer'),
		},

		// Exams
		{
			category: 'exams',
			question: t('faq.questions.exams.examTypes.question'),
			answer: t('faq.questions.exams.examTypes.answer'),
		},
		{
			category: 'exams',
			question: t('faq.questions.exams.retake.question'),
			answer: t('faq.questions.exams.retake.answer'),
		},
		{
			category: 'exams',
			question: t('faq.questions.exams.toeicPrep.question'),
			answer: t('faq.questions.exams.toeicPrep.answer'),
		},

		// Programs
		{
			category: 'programs',
			question: t('faq.questions.programs.difference.question'),
			answer: t('faq.questions.programs.difference.answer'),
		},
		{
			category: 'programs',
			question: t('faq.questions.programs.progress.question'),
			answer: t('faq.questions.programs.progress.answer'),
		},

		// Account
		{
			category: 'account',
			question: t('faq.questions.account.forgotPassword.question'),
			answer: t('faq.questions.account.forgotPassword.answer'),
		},
		{
			category: 'account',
			question: t('faq.questions.account.changeEmail.question'),
			answer: t('faq.questions.account.changeEmail.answer'),
		},
		{
			category: 'account',
			question: t('faq.questions.account.deleteAccount.question'),
			answer: t('faq.questions.account.deleteAccount.answer'),
		},

		// Technical
		{
			category: 'technical',
			question: t('faq.questions.technical.browserSupport.question'),
			answer: t('faq.questions.technical.browserSupport.answer'),
		},
		{
			category: 'technical',
			question: t('faq.questions.technical.mobileApp.question'),
			answer: t('faq.questions.technical.mobileApp.answer'),
		},
		{
			category: 'technical',
			question: t('faq.questions.technical.videoNotPlaying.question'),
			answer: t('faq.questions.technical.videoNotPlaying.answer'),
		},

		// AI
		{
			category: 'ai',
			question: t('faq.questions.ai.chatbot.question'),
			answer: t('faq.questions.ai.chatbot.answer'),
		},
		{
			category: 'ai',
			question: t('faq.questions.ai.recommendations.question'),
			answer: t('faq.questions.ai.recommendations.answer'),
		},
	];

	const filteredFaqs = faqs.filter(faq => {
		const matchesSearch =
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<Container maxWidth="lg" sx={{ py: 8 }}>
			<GradientTitle align="center" gutterBottom>
				{t('faq.title')}
			</GradientTitle>
			<Typography variant="h6" color="text.secondary" align="center" mb={6}>
				{t('faq.subtitle')}
			</Typography>

			{/* Search */}
			<Paper elevation={2} sx={{ mb: 4, p: 2 }}>
				<TextField
					fullWidth
					placeholder={t('faq.searchPlaceholder')}
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
					sx={{
						'& .MuiOutlinedInput-root': {
							borderRadius: 3,
						},
					}}
				/>
			</Paper>

			{/* Categories */}
			<Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
				{categories.map(category => (
					<Chip
						key={category.id}
						label={category.label}
						onClick={() => setSelectedCategory(category.id)}
						color={selectedCategory === category.id ? 'primary' : 'default'}
						variant={selectedCategory === category.id ? 'filled' : 'outlined'}
						sx={{ cursor: 'pointer' }}
					/>
				))}
			</Box>

			{/* FAQ List */}
			<Box>
				{filteredFaqs.length > 0 ? (
					filteredFaqs.map((faq, index) => (
						<Accordion
							key={index}
							elevation={1}
							sx={{
								mb: 2,
								borderRadius: 2,
								'&:before': { display: 'none' },
								'&.Mui-expanded': {
									boxShadow: 3,
								},
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								sx={{
									borderRadius: 2,
									'&.Mui-expanded': {
										borderBottomLeftRadius: 0,
										borderBottomRightRadius: 0,
									},
								}}
							>
								<Typography variant="h6" fontWeight={600}>
									{faq.question}
								</Typography>
							</AccordionSummary>
							<AccordionDetails sx={{ pt: 2 }}>
								<Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
									{faq.answer}
								</Typography>
							</AccordionDetails>
						</Accordion>
					))
				) : (
					<Paper sx={{ p: 4, textAlign: 'center' }}>
						<Typography color="text.secondary">{t('faq.noResults')}</Typography>
					</Paper>
				)}
			</Box>

			{/* Contact Support */}
			<Paper elevation={3} sx={{ mt: 8, p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
				<Typography variant="h5" gutterBottom>
					{t('faq.stillHaveQuestions')}
				</Typography>
				<Typography variant="body1" mb={2}>
					{t('faq.contactSupport')}
				</Typography>
				<Typography variant="body2">
					Email: support@englishforce.com
					<br />
					Phone: +84 123 456 789
				</Typography>
			</Paper>
		</Container>
	);
};

export default FAQ;