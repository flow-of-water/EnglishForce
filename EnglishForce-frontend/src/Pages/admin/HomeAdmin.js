import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useEffect , useState } from "react";
import StripeChart from "../../Components/StripeChart.js"
import axiosInstance from "../../Api/axiosInstance";

const AdminHome = () => {
  const [totalUsers,setTotalUsers] = useState(0) ;
  const [totalCourses,setTotalCourses] = useState(0) ;
  const [totalEnrollments,setTotalEnrollments] = useState(0) ;

  useEffect(()=>{
    const fetch = async () => {
      const response = await axiosInstance.get("/user-course/statistics") ;
      setTotalUsers(response.data.totalUsers)
      setTotalCourses(response.data.totalCourses)
      setTotalEnrollments(response.data.totalEnrollments)
    }
    fetch() ;
  },[])
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
        </Grid>

        <StripeChart />
      </div>
  );
};

export default AdminHome;
