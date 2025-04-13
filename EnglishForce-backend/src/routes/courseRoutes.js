import express from "express";
import { getCoursesController, getCourseByIdController, updateCourseController, addCourseController, deleteCourseController, getCoursesBySearch } from "../controllers/courseController.js";
import { authMiddleware, adminMiddleware, authMiddlewareWithoutError } from "../middleware/authorize.js";
import { uploadImage, uploadVideo } from "../config/cloudinary.config.js";

const router = express.Router();



// Search khóa học
router.get("/search", getCoursesBySearch);

router.get("/", authMiddlewareWithoutError, getCoursesController);
// Lấy thông tin khóa học theo ID
router.get("/:id", authMiddleware, getCourseByIdController);

// Cập nhật thông tin khóa học
router.put("/:id", authMiddleware, adminMiddleware, uploadImage.single('thumbnail'), updateCourseController);


// Thêm khóa học mới
router.post("/", authMiddleware, adminMiddleware, uploadImage.single('thumbnail'), addCourseController);

// Xóa khóa học
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourseController);

// Upload course video 
router.post('/upload_video', uploadVideo.single('video'), (req, res) => {
    res.status(200).json({ url: req.file.path });
});

export default router;