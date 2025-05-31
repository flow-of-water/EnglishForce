import React, { useEffect, useState } from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import axiosInstance from "../../Api/axiosInstance";
import CourseCard from "../../Components/user/CourseCard";
import { HomeFeatures } from "../../Components/user/HomeFeatures";
import Slider from "react-slick"; // Import Carousel
import { Link } from 'react-router-dom';

// Import CSS cho carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Height } from "@mui/icons-material";

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axiosInstance.get("/courses/top-rated");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  // Cấu hình cho carousel
  const sliderSettings = {
    dots: true,
    infinite: courses.length > 2,
    speed: 500,
    slidesToShow: 3,  // Hiển thị 3 khóa học cùng lúc
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // Khi màn hình nhỏ hơn 1024px, hiển thị 2 card
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // Khi màn hình nhỏ hơn 600px, hiển thị 1 card
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
              <Box
          sx={{
            height: '90vh',  // full viewport height
            width: '100%',
            position: 'relative',
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')`, 
            // backgroundImage: `url('https://i.pinimg.com/736x/ab/68/f6/ab68f66366b2582b000aedd27f20ed70.jpg')`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {/* Overlay đen mờ */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
            }}
          />
    
          {/* Nội dung hero */}
          <Container
            maxWidth="md"
            sx={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              px: 3,
            }}
          >
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome to English Force
            </Typography>
            <Typography variant="h5" paragraph>
              Your ultimate platform for effective and fun English learning.
            </Typography>
            <Link to="/program">
            <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }}>
              Get Started
            </Button>
            </Link>
          </Container>
        </Box>
      {/* Hero Section */}
      {/* <Box sx={{ textAlign: "center", py: 6, bgcolor: "#f5f5f5" }}>
        <Typography variant="h3" gutterBottom>
          Learn Anytime, Anywhere
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Join thousands of learners in upgrading your skills today!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/courses">
          Get Started
        </Button>
      </Box> */}

      <HomeFeatures />

      {/* Courses Carousel Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom align="center">
          Popular Courses
        </Typography>
        {courses.length > 0 ? (
          <Slider {...sliderSettings}>
            {courses.map((course, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <CourseCard course={course} sx={{minHeight: "50%vp"}} />
              </Box>
            ))}
          </Slider>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No courses available at the moment.
          </Typography>
        )}
      </Container>

    </>
  );
};

export default HomePage;
