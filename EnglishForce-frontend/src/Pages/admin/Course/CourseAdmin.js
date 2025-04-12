import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance"

const CourseAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {

    async function fetchCourses() {
      try {
        const response = await axiosInstance.get(`/courses/?page=${page}`);
        setCourses(response.data.courses); // Gán trực tiếp dữ liệu trả về từ API
        setPageCount(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses(); // Gọi hàm fetchCourses
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      const response = await axiosInstance.delete(`/courses/${id}`);
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manage Courses</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} component={Link} to={`/admin/courses/create`} >Add New Course</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Students</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.author}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>
                  <Button color="primary" component={Link} to={`/admin/courses/${course.id}`}>Detail</Button>
                  <Button onClick={() => handleDelete(course.id)} color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {courses.length != 0 && <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      />}
    </Container>
  );
};

export default CourseAdmin;
