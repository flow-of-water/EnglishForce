import React from "react";
import { CardMedia } from "@mui/material";

const imageProgress = ({course}) => {
    return course.thumbnail ? course.thumbnail  : "/Errores-Web-404.jpg" ;
};
export default function CourseImage(course) {
    return <CardMedia
        component="img"
        height="200"
        image={imageProgress(course)}
        alt={course.name}
    />
}