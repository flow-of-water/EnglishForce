// AboutUs.jsx
import { Container, Typography, Grid, Card, Avatar, Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          About EnglishForce
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto">
          Empowering learners worldwide with AI-powered English education
        </Typography>
      </Box>

      {/* Mission */}
      <Box mb={8}>
        <Typography variant="h4" gutterBottom>Our Mission</Typography>
        <Typography variant="body1" color="text.secondary">
          EnglishForce was created to democratize English learning through innovative 
          AI technology, making quality education accessible to everyone, everywhere.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={4} mb={8}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">10K+</Typography>
            <Typography>Active Learners</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">500+</Typography>
            <Typography>Courses</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">95%</Typography>
            <Typography>Success Rate</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">50+</Typography>
            <Typography>Expert Teachers</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Team */}
      <Box mb={8}>
        <Typography variant="h4" gutterBottom textAlign="center">Our Team</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }} />
              <Typography variant="h6">John Doe</Typography>
              <Typography color="text.secondary">Founder & CEO</Typography>
            </Card>
          </Grid>
          {/* More team members */}
        </Grid>
      </Box>

      {/* Values */}
      <Box>
        <Typography variant="h4" gutterBottom>Our Values</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">🚀 Innovation</Typography>
            <Typography>Leveraging AI to create personalized learning experiences</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">🎯 Quality</Typography>
            <Typography>Expert-curated content that delivers results</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">🌍 Accessibility</Typography>
            <Typography>Making education available to everyone</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">💡 Student-First</Typography>
            <Typography>Your success is our priority</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUs;