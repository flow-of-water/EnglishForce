import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance";
import CourseCard from "../../Components/CourseCard";
import Slider from "react-slick"; // Import Carousel

// Import CSS cho carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Height } from "@mui/icons-material";

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axiosInstance.get("/courses");
        setCourses(response.data.courses);
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
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 6, bgcolor: "#f5f5f5" }}>
        <Typography variant="h3" gutterBottom>
          Learn Anytime, Anywhere
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Join thousands of learners in upgrading your skills today!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/courses">
          Get Started
        </Button>
      </Box>

      {/* Courses Carousel Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
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
