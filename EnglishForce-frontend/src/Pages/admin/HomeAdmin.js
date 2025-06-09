import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import StripeChart from "../../Components/admin/StripeChart.js"
import axiosInstance from "../../Api/axiosInstance";

const AdminHome = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [totalExamAttempts, setTotalExamAttempts] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axiosInstance.get("/user-course/statistics");
        setTotalUsers(response.data.totalUsers)
        setTotalCourses(response.data.totalCourses)
        setTotalEnrollments(response.data.totalEnrollments)
        setTotalPrograms(response.data.totalPrograms);
        setTotalExams(response.data.totalExams);
        setTotalExamAttempts(response.data.totalExamAttempts);
      } catch (error) {
        console.error("Error when fetch statistics:", error);
      }
    }
    fetch();
  }, [])
  return (
    <div className="container mt-4">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Card 1 - Số lượng người dùng */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 - Số khóa học */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6">Total Courses</Typography>
              <Typography variant="h4">{totalCourses}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 - Số lượt đăng ký */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6">Total Enrollments</Typography>
              <Typography variant="h4">{totalEnrollments}</Typography>
            </CardContent>
          </Card>
        </Grid>


        {/* Card 4 - Số chương trình học */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6">Total Programs</Typography>
              <Typography variant="h4">{totalPrograms}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 - Số đề thi */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6">Total Exams</Typography>
              <Typography variant="h4">{totalExams}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 6 - Số lượt làm bài thi */}
        <Grid item xs={12} md={4}>
          <Card className="shadow-sm">
            <CardContent>
              <Typography variant="h6">Total Exam Attempts</Typography>
              <Typography variant="h4">{totalExamAttempts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <StripeChart />
    </div>
  );
};

export default AdminHome;
