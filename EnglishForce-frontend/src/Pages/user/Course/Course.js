import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Container,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";
import CourseCard from "../../../Components/CourseCard";
import { CartContext } from "../../../Context/CartContext";
import { useSearch, SearchContext } from "../../../Context/SearchContext";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(1);
  // const { searchQuery } = useSearch();
  const {searchQuery, currentPage, updatePage} = useContext(SearchContext) ;
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let url = `/courses?page=${currentPage}`;
        if (searchQuery) url += `&q=${searchQuery}`;

        const response = await axiosInstance.get(url);
        setCourses(response.data.courses);
        setPageCount(response.data.totalPages)
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage,searchQuery]);

  const handlePageChange = (event, value) => {
    updatePage(value);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Available Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>

      {courses.length != 0 &&
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: "flex", justifyContent: "center", mt: 4 }}
        />
      }
    </Container>
  );
};

export default CoursesPage;