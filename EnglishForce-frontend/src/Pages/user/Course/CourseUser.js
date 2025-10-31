import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Chip,
  Button,
  Tooltip,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../../Api/axiosInstance";
import CourseImage from "../../../Components/user/CourseImage";
import CircularLoading from "../../../Components/Loading";
import GradientTitle from "../../../Components/GradientTitle";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get("/user-course/user");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <CircularLoading />;

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (courses.length === 0) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <GradientTitle>You have not enrolled in any courses yet.</GradientTitle>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 4,
        minHeight: "100vh",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: -120,
          zIndex: -1,
          background:
            "radial-gradient(700px 260px at 15% -5%, rgba(33,150,243,0.10), transparent 60%), radial-gradient(700px 240px at 85% -5%, rgba(156,39,176,0.10), transparent 60%)",
        },
      }}
    >
      <Container>
        <GradientTitle>My learning</GradientTitle>

        <Grid container spacing={4}>
          {courses.map((course) => {
            const author = course.instructor || course.author || "Unknown instructor";
            return (
              <Grid item xs={12} sm={6} md={4} key={course.public_id}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
                    overflow: "hidden",
                    boxShadow: "0 10px 26px rgba(2,24,43,0.06)",
                    position: "relative",
                    transition:
                      "transform .45s cubic-bezier(0.22,1,0.36,1), box-shadow .45s",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.015)",
                      boxShadow: "0 20px 60px rgba(33,150,243,0.18)",
                    },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: 4,
                      padding: "1px",
                      background:
                        "linear-gradient(135deg, rgba(33,150,243,0.30), rgba(156,39,176,0.30))",
                      WebkitMask:
                        "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      pointerEvents: "none",
                    },
                  }}
                >
                  {/* Thumbnail */}
                  <Box sx={{ position: "relative", height: 180, overflow: "hidden" }}>
                    <CourseImage course={course} />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 65%)",
                      }}
                    />
                    <Chip
                      label="Enrolled"
                      color="success"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        fontWeight: 700,
                        backdropFilter: "blur(6px)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(75deg, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.0) 60%)",
                        transform: "translateX(-120%)",
                        transition: "transform .8s ease",
                        ".MuiCard-root:hover &": { transform: "translateX(120%)" },
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.1,
                      p: 2.5,
                      flexGrow: 1,            // 🔑 giúp nội dung chiếm hết chiều cao còn lại
                    }}
                  >
                    <Tooltip title={course.name} placement="top-start">
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          letterSpacing: 0.15,
                          transition: "color .25s",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {course.name}
                      </Typography>
                    </Tooltip>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      by {author}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        opacity: 0.9,
                        minHeight: 60,
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Divider sx={{ my: 0.5, borderColor: "rgba(0,0,0,0.06)" }} />

                    {/* Footer: đẩy xuống đáy + nút fullWidth để đồng nhất giữa các card */}
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        fullWidth                 // 🔑 chiều ngang bằng nhau
                        component={Link}
                        to={`/courses/${course.public_id}`}
                        sx={{
                          borderRadius: 999,
                          py: 1,                 // cùng chiều cao
                          fontWeight: 800,
                          textTransform: "none",
                          boxShadow: "0 8px 24px rgba(33,150,243,0.2)",
                          "&:hover": { boxShadow: "0 12px 30px rgba(33,150,243,0.28)" },
                        }}
                      >
                        Continue learning
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default CoursesPage;
