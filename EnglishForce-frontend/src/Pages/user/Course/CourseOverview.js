import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Container, Typography, Card, CardMedia, CardContent, Box, Button, CircularProgress, 
  Alert, Rating, List, ListItem, ListItemText, Divider, Snackbar , TextField
} from "@mui/material";
import axiosInstance from "../../../Api/axiosInstance";
import { CartContext } from "../../../Context/CartContext";

function imageProgress(course) {
  return course.thumbnail
    ? `data:image/png;base64,${course.thumbnail}`
    : "/Errores-Web-404.jpg";
}

function RatingBox({ courseId , initialRating = null, initialReview = "" , setMyRating, setMyComment}) {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [submitted, setSubmitted] = useState(initialRating !== null || initialReview !== "");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async () => {
    if (rating) {
      const response = await axiosInstance.patch("/user-course/rating",{
        courseId:courseId , rating , comment:review
      });
      setSubmitted(true);
      setOpenSnackbar(true);
      setMyRating(rating);
      setMyComment(review) ;
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2}}>
      <Typography variant="h6">Your rating</Typography>
      <Rating
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        precision={1}
      />
      <TextField
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        margin="normal"
        label="Enter review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!rating}
        >
          {submitted ? "Update rating" : "Send Rating"}
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {submitted ? "Rating is updated!" : "Rating is sent!"}
        </Alert>
      </Snackbar>
    </Box>
  );
}



const CourseOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(true);
  const [averageRating, setAverageRating] = useState(4.5);
  const [totalReviews, setTotalReviews] = useState(100);
  const [reviews, setReviews] = useState([]); 
  const [myRating, setMyRating] = useState(null) ;
  const [myComment, setMyComment] = useState("") ;
  const token = localStorage.getItem("token") ;


  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseRes = await axiosInstance.get(`/user-course/course-overview/${id}`);
        setCourse(courseRes.data.course);
        setIsPurchased(courseRes.data.owned);
        setAverageRating(courseRes.data.overview.average_rating)
        setTotalReviews(courseRes.data.overview.total_rating)
        setReviews(courseRes.data.reviews) ;
        
        const userCourse = courseRes.data.userCourse ;
        if(userCourse) {
          setMyRating(userCourse.rating) ;
          setMyComment(userCourse.comment) ;
        }

      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Không tìm thấy khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, myRating, myComment]);


  if (loading) return <Container sx={{ textAlign: "center", mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ textAlign: "center", mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  const handleAddToCart = () => {
    addToCart(course);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Card>
        <CardMedia component="img" height="250" image={imageProgress(course)} alt={course.title} />
        <CardContent>
          <Typography variant="h4" gutterBottom>{course.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">By {course.author}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{course.description}</Typography>
          <Typography variant="h5" color="primary" sx={{ mt: 2 }}>${course.price?course.price:0}</Typography>

          {/* Hiển thị Rating */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Student Ratings:
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {averageRating&&<Typography variant="body1" fontWeight="bold" sx={{color: "#faaf00" , fontSize:"18px"}}>{Number(averageRating).toFixed(1)}</Typography>}
            <Rating value={averageRating} precision={0.1} readOnly />
          </div>
          <Typography variant="body2" color="text.secondary">
            ({totalReviews} reviews)
          </Typography>

          {isPurchased ? (
            <Button variant="contained" color="success" sx={{ mt: 3, mr: 2 }} onClick={() => navigate(`/courses/${id}`)}>
              Go to Course
            </Button>
          ) : token &&(
            <>
              <Button variant="contained" color="primary" sx={{ mt: 3, mr: 2 }} onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button variant="outlined" color="secondary" sx={{ mt: 3, mr: 2 }} component={Link} to="/cart">
                Go to Cart
              </Button>
            </>
          )}

          <Button variant="contained" color="secondary" sx={{ mt: 3 }} component={Link} to="/courses">
            Back to Courses
          </Button>

          {/* Hiển thị danh sách đánh giá của học viên */}
          <Typography variant="h6" sx={{ mt: 4 }}>
            Student Reviews
          </Typography>
           {isPurchased && <RatingBox 
           courseId={id} initialRating={myRating} initialReview={myComment} 
           setMyRating={setMyRating} setMyComment={setMyComment}
           />}
          {reviews.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Chưa có đánh giá nào cho khóa học này.
            </Typography>
          ) : (
            <List sx={{ mt: 2 }}>
              {reviews.map((review, index) => (
                review.rating && (
                <React.Fragment key={review.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.username}
                          </Typography>
                          <Rating value={review.rating} precision={0.5} readOnly />
                        </>
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
    </Container>
  );
};

export default CourseOverview;
