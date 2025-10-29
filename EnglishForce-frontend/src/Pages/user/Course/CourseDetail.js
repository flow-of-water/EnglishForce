import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent, Button, Grid, Tab, Tabs, Box, TextField } from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";
import CourseVideoPlayer from "../../../Components/user/CourseVideoPlayer";
import CourseSidebar from '../../../Components/user/CourseSideBar';
import Comments from "../../../Components/user/Comments";
import CircularLoading from "../../../Components/Loading";
import CourseNote from "../../../Components/user/CourseNote";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";


function imageProgress(course) {
  return course.thumbnail ? course.thumbnail : "/Errores-Web-404.jpg"
}

const CourseDetail = () => {
  const { publicId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [valueTab, setValueTab] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchCourseAndSections = async () => {
      try {
        // Gọi API lấy thông tin khóa học
        const courseRes = await axiosInstance.get(`/courses/${publicId}`);
        setCourse(courseRes.data);

        // Gọi API lấy danh sách sections theo coursePublicId
        const sectionsRes = await axiosInstance.get(`/course_sections/course/${publicId}`);
        setSections(sectionsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("The course is not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndSections();
  }, [publicId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  if (loading) return <CircularLoading />;
  if (error) return <Box mt={4} textAlign="center">
    <Typography variant="h6" color="error">
      {error}
    </Typography>
  </Box>
  if (!course) return <p>No course data available.</p>;

  return (
    <Container sx={{ mt: 4 }}>
      <CourseSidebar
        sections={sections}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleClickItem={setSelectedSection}
      />


      <Card>
        <CardMedia component="img" height="250" image={imageProgress(course)} alt={course.name} />
        <CardContent>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {course.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {course.description}
          </Typography>

          <Tabs
            value={valueTab}
            onChange={handleChangeTab}
            aria-label="course detail tabs"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              mb: 3,
              "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
            }}
          >
            <Tab icon={<PlayCircleOutlineIcon />} iconPosition="start" label="Course Sections" />
            <Tab icon={<ForumOutlinedIcon />} iconPosition="start" label="Q / A" />
            <Tab icon={<NoteAltOutlinedIcon />} iconPosition="start" label="Your Notes" />
          </Tabs>

          {/* Hiển thị các Course Sections  hoặc Q/A */}
          {valueTab == 0 && (<>
            {sections.length === 0 ? (
              <Typography variant="body2">No sections available for this course yet.</Typography>
            ) : (<>
              <Box mb={2}>
                <Button
                  variant="contained"
                  onClick={handleDrawerToggle}
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    fontWeight: 600,
                    px: 3,
                    background: "linear-gradient(to right, #1976d2, #00c6ff)",
                    boxShadow: "0 0 10px rgba(25,118,210,0.3)",
                    "&:hover": {
                      background: "linear-gradient(to right, #1565c0, #00bcd4)",
                    },
                  }}
                >
                  Browse Course Content
                </Button>
              </Box>
              {selectedSection ?
                <Grid container spacing={3}>
                  <Grid item xs={12} key={selectedSection.public_id}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6">{selectedSection.name}</Typography>
                      <Typography variant="body2">{selectedSection.description}</Typography>
                      <CourseVideoPlayer url={selectedSection.video_link} />
                    </Card>
                  </Grid>
                </Grid>
                :
                <Grid container spacing={3}>
                  {sections.map((section) => (
                    <Grid item xs={12} key={section.public_id}>
                      <Card sx={{
                        p: 2,
                        borderRadius: 3,
                        transition: "all 0.25s ease",
                        "&:hover": {
                          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                          transform: "translateY(-4px)",
                        },
                      }}>
                        <Typography variant="h6">{section.name}</Typography>
                        <Typography variant="body2">{section.description}</Typography>
                        <CourseVideoPlayer url={section.video_link} />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              }
            </>)}
          </>)}
          {valueTab == 1 && <Comments coursePublicId={publicId} />}
          {valueTab == 2 && <CourseNote coursePublicId={publicId} />}

          {/* Back Button */}
          <Button variant="contained" color="secondary" sx={{ mt: 3 }} component={Link} to="/courses">
            Back to Courses
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CourseDetail;
