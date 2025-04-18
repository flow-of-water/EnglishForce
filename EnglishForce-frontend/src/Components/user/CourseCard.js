import React from "react";
import CourseImage from "./CourseImage";
import { CardContent, Typography, Button, Card, Rating, Box, CardActionArea, Badge } from "@mui/material";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
    return (
        <Card
            sx={{
                height: "450px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CardActionArea
                component={Link}
                to={`/courses/overview/${course.public_id}`}
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            >
                <CourseImage course={course} />

                {/*Show "Purchased" if user bought this course */}
                {course.is_purchased && (
                    <Badge
                        badgeContent="Purchased"
                        color="secondary"
                        sx={{
                            position: "absolute",
                            top: 15,
                            right: 40,
                            zIndex: 1,
                        }}
                    />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {course.name}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        by {course.instructor}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {course.description}
                    </Typography>

                    {/* Rating */}
                    <Box sx={{ mt: "1px", display: "flex", alignItems: "center" }}>
                        <Rating
                            name="course-rating"
                            value={course.average_rating || 0}
                            precision={0.5}
                            readOnly
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({course.total_rating || 0} ratings)
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                        {course.price ? `$${course.price}` : "Free"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CourseCard;