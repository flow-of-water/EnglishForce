import { Typography, Container, Box, Paper, Grid, Stack, Divider, Button } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 6, md: 10 } }}>
            <Container>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={6}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Box flex={1} textAlign={{ xs: 'center', md: 'left' }}>
                        <Typography variant="h3" fontWeight={600} gutterBottom>
                            Learn Anytime, Anywhere
                        </Typography>
                        <Typography variant="h6" color="text.secondary" mb={3}>
                            Join thousands of learners and upgrade your English skills with AI-powered lessons.
                        </Typography>
                        <Button variant="contained" color="primary" size="large" component={Link} to="/courses">
                            Get Started
                        </Button>
                        <Button variant="outlined" size="large" component={Link} to="/exams" sx={{ mx: 2 }}>
                            Take exams
                        </Button>
                    </Box>
                    <Box flex={1} display="flex" justifyContent="center">
                        <img
                            src="English-force.png"
                            alt="Learn English"
                            style={{ width: '100%', maxWidth: 400, maxHeight: 400, borderRadius: '10px' }}
                        />
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};


const features = [
    {
        icon: <PsychologyAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
        title: 'AI-Powered Learning',
        description: 'Smart chatbot and personalized recommendations based on your progress.'
    },
    {
        icon: <AutoStoriesIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
        title: 'Free English Program',
        description: 'A structured program to improve all 4 skills: listening, speaking, reading, and writing.'
    },
    {
        icon: <QuizIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
        title: 'Exam Simulations',
        description: 'Practice with mock tests that mimic actual TOEIC exams.'
    },
    {
        icon: <SchoolIcon sx={{ fontSize: 40, color: 'success.main' }} />,
        title: 'Video-based Courses',
        description: 'Learn with engaging videos. No quizzes – just watch and absorb knowledge!'
    },
];

const WhyUsSection = () => {
    return (
        <Box sx={{ bgcolor: "#ffffff", py: 8 }}>
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Why Choose EnglishForce?
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" maxWidth="md" sx={{ mx: 'auto', mb: 6 }}>
                    We blend smart technology and proven methods to deliver an online learning experience that feels personal, structured, and effective.
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {features.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                                <Stack spacing={2} alignItems="center" textAlign="center">
                                    {item.icon}
                                    <Typography variant="h6">{item.title}</Typography>
                                    <Divider sx={{ width: 40, bgcolor: 'primary.main' }} />
                                    <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};



const TestimonialCard = ({ name, feedback }) => (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 300 }}>
        <FormatQuoteIcon color="disabled" />
        <Typography variant="body1" gutterBottom>"{feedback}"</Typography>
        <Typography variant="subtitle2" color="primary">— {name}</Typography>
    </Paper>
);


export const HomeFeatures = () => {
    return (<>
        <HeroSection />
        {/* Why Us */}
        <WhyUsSection />

        {/* Testimonials */}
        {/* <Box sx={{ py: 6 }}>
            <Container>
                <Typography variant="h4" gutterBottom>What Our Students Say</Typography>
                <Box display="flex" justifyContent="center" flexWrap="wrap" gap={4} mt={4}>
                    <TestimonialCard
                        name="Minh T."
                        feedback="I improved my IELTS score by 1.5 bands in just 2 months with this platform!"
                    />
                    <TestimonialCard
                        name="Ngoc Anh"
                        feedback="The exam system feels just like real TOEIC practice. Love it!"
                    />
                    <TestimonialCard
                        name="Thanh"
                        feedback="The video + audio content makes learning super engaging. Highly recommend!"
                    />
                </Box>
            </Container>
        </Box> */}
    </>)
}