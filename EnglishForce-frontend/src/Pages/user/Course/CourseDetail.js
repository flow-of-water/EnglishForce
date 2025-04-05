import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Typography, Card, CardMedia, CardContent, Button, Grid, Tab, Tabs } from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";
import CourseVideoPlayer from "../../../Components/CourseVideoPlayer";
import CourseSidebar from '../../../Components/CourseSideBar';
import Comments from "../../../Components/Comments";
function imageProgress(course) {
  return course.thumbnail ? `data:image/png;base64,${course.thumbnail}` : "/Errores-Web-404.jpg"
}

const drawerWidth = 240;
const CourseDetail = () => {
  const { id } = useParams();
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
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        // Gọi API lấy thông tin khóa học
        const courseRes = await axiosInstance.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // Gọi API lấy danh sách sections theo courseId
        const sectionsRes = await axiosInstance.get(`/course_sections/course/${id}`);
        setSections(sectionsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không tìm thấy khóa học!");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndSections();
  }, [id]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!course) return <p>Không có dữ liệu khóa học.</p>;

  return (
    <Container sx={{ mt: 4 }}>
      <CourseSidebar
        sections={sections}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleClickItem={setSelectedSection}
      />


      <Card>
        <CardMedia component="img" height="250" image={imageProgress(course)} alt={course.title} />
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {course.description}
          </Typography>

          <Tabs value={valueTab} onChange={handleChangeTab} aria-label="custom tabs example" sx={{ mb: 2 }}>
            <Tab label="Course Sections" />
            <Tab label="Q/A" />
          </Tabs>
          {/* Hiển thị các Course Sections  hoặc Q/A */}
          {valueTab == 0 && (<>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Course Sections
            </Typography>
            {sections.length === 0 ? (
              <Typography variant="body2">Chưa có section nào cho khóa học này.</Typography>
            ) : (<>
              <Button variant="text" onClick={handleDrawerToggle}>Course Content</Button>
              {selectedSection ?
                <Grid container spacing={3}>
                    <Grid item xs={12} key={selectedSection.id}>
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
                    <Grid item xs={12} key={section.id}>
                      <Card sx={{ p: 2 }}>
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
          {valueTab == 1 && <Comments courseId={id} />}

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
