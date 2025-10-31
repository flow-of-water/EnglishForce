import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container, Typography, Card, CardMedia, CardContent, Box, Button,
  Alert, Rating, List, ListItem, ListItemText, Divider, Snackbar, TextField, Chip, Stack, Paper
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";
import { CartContext } from "../../../Context/CartContext";
import CircularLoading from "../../../Components/Loading";

// ========= helpers =========
function imageProgress(course) {
  return course?.thumbnail ? course.thumbnail : "/Errores-Web-404.jpg";
}

function RatingBox({ coursePubicId, initialRating = null, initialReview = "", setMyRating, setMyComment }) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [submitted, setSubmitted] = useState(initialRating !== null || initialReview !== "");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async () => {
    if (rating) {
      await axiosInstance.patch("/user-course/rating", {
        coursePublicId: coursePubicId, rating, comment: review
      });
      setSubmitted(true);
      setOpenSnackbar(true);
      setMyRating(rating);
      setMyComment(review);
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "linear-gradient(145deg,#fff 0%,#f9fbff 100%)",
        boxShadow: "0 8px 26px rgba(2,24,43,0.06)",
      }}
    >
      <Typography variant="h6" fontWeight={800} gutterBottom>Your rating</Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Rating value={rating} onChange={(e, v) => setRating(v)} precision={1} />
        {rating ? <Chip size="small" label={`${rating}/5`} /> : null}
      </Stack>
      <TextField
        fullWidth multiline rows={2} variant="outlined" margin="normal"
        label="Enter review" value={review} onChange={(e) => setReview(e.target.value)}
      />
      <Box mt={1}>
        <Button
          variant="contained" color="primary" onClick={handleSubmit} disabled={!rating}
          sx={{
            px: 3, py: 1, textTransform: "none", fontWeight: 800, borderRadius: 999,
            boxShadow: "0 10px 24px rgba(33,150,243,0.25)"
          }}
        >
          {submitted ? "Update rating" : "Send Rating"}
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {submitted ? "Rating is updated!" : "Rating is sent!"}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

// ========= main =========
const CourseOverview = () => {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', success: true });
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(true);
  const [averageRating, setAverageRating] = useState(4.5);
  const [totalReviews, setTotalReviews] = useState(100);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(null);
  const [myComment, setMyComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseRes = await axiosInstance.get(`/user-course/course-overview/${publicId}`);
        setCourse(courseRes.data.course);
        setIsPurchased(courseRes.data.owned);
        setAverageRating(courseRes.data.overview.average_rating);
        setTotalReviews(courseRes.data.overview.total_rating);
        setReviews(courseRes.data.reviews);

        const userCourse = courseRes.data.userCourse;
        if (userCourse) {
          setMyRating(userCourse.rating);
          setMyComment(userCourse.comment);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("No course found.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [publicId, myRating, myComment]);

  useEffect(() => {
    if (publicId) {
      axiosInstance.post('/interactions', { course_public_id: publicId, score: 1 })
        .catch((err) => { console.warn("Failed to log interaction:", err); });
    }
  }, [publicId]);

  if (loading) return <CircularLoading />;
  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const handleAddToCart = () => {
    const result = addToCart(course);
    setSnackbar({ open: true, message: result.message, success: result.success });
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* Hero card */}
      <Card
        sx={{
          overflow: "hidden",
          borderRadius: 4,
          boxShadow: "0 18px 60px rgba(33,150,243,0.12)",
          border: "1px solid rgba(25,118,210,0.12)",
          mb: 3,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia component="img" height="260" image={imageProgress(course)} alt={course.name} />
          {/* overlay gradient + price chip */}
          <Box
            sx={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 60%)",
            }}
          />
          <Chip
            label={`$${course.price ? course.price : 0}`}
            color="primary"
            sx={{
              position: "absolute", bottom: 16, right: 16,
              fontWeight: 800, borderRadius: 999, px: 1.5, backdropFilter: "blur(4px)",
            }}
          />
        </Box>

        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Typography variant="h4" fontWeight={900} gutterBottom>{course.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">By {course.instructor}</Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>{course.description}</Typography>

          {/* Rating block */}
          <Box sx={{ mt: 2.5 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Student Ratings</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              {averageRating !== undefined && averageRating !== null && (
                <Chip
                  label={Number(averageRating).toFixed(1)}
                  sx={{ fontWeight: 800, color: "#faaf00", borderColor: "#faaf00" }}
                  variant="outlined"
                />
              )}
              <Rating value={averageRating || 0} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({totalReviews} reviews)
              </Typography>
            </Stack>
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={1.5} sx={{ mt: 3 }} useFlexGap flexWrap="wrap">
            {isPurchased ? (
              <Button
                variant="contained" color="success"
                onClick={() => navigate(`/courses/${publicId}`)}
                sx={{
                  textTransform: "none", fontWeight: 900, borderRadius: 999, px: 2.5,
                  boxShadow: "0 10px 26px rgba(76,175,80,0.25)",
                }}
              >
                Go to Course
              </Button>
            ) : token && (
              <>
                <Button
                  variant="contained" color="primary" onClick={handleAddToCart}
                  sx={{
                    textTransform: "none", fontWeight: 900, borderRadius: 999, px: 2.5,
                    boxShadow: "0 10px 26px rgba(33,150,243,0.25)",
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined" color="secondary" component={Link} to="/cart"
                  sx={{ textTransform: "none", fontWeight: 800, borderRadius: 999, px: 2.5 }}
                >
                  Go to Cart
                </Button>
              </>
            )}
            <Button
              variant="contained" color="secondary" component={Link} to="/courses"
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 999, px: 2.5 }}
            >
              Back to Courses
            </Button>
          </Stack>

          {/* Reviews */}
          <Typography variant="h6" sx={{ mt: 4 }} fontWeight={800}>
            Student Reviews
          </Typography>

          {isPurchased && (
            <Box sx={{ mt: 1.5 }}>
              <RatingBox
                coursePubicId={publicId}
                initialRating={myRating}
                initialReview={myComment}
                setMyRating={setMyRating}
                setMyComment={setMyComment}
              />
            </Box>
          )}

          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              The course has not received any reviews yet.
            </Typography>
          ) : (
            <List sx={{ mt: 2 }}>
              {reviews.map((review, index) => (
                review.rating && (
                  <React.Fragment key={review.user_id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle1" fontWeight="bold">{review.username}</Typography>
                            <Rating value={review.rating} precision={0.5} readOnly size="small" />
                            <Chip size="small" label={`${review.rating}/5`} />
                          </Stack>
                        }
                        secondary={review.comment}
                      />
                    </ListItem>
                    {index < reviews.length - 1 && <Divider />}
                  </React.Fragment>
                )
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={snackbar.success ? 'success' : 'warning'}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseOverview;
