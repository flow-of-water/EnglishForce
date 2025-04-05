import express from "express";
import { getCoursesController, getCourseByIdController, updateCourseController, addCourseController, deleteCourseController, getCoursesBySearch } from "../controllers/courseController.js";
import { authMiddleware, adminMiddleware, authMiddlewareWithoutError } from "../middleware/authorize.js";  
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage(); // Lưu ảnh dưới dạng Buffer
const upload = multer({ storage });

// Search khóa học
router.get("/search", getCoursesBySearch) ;

router.get("/",authMiddlewareWithoutError, getCoursesController);
// Lấy thông tin khóa học theo ID
router.get("/:id", authMiddleware, getCourseByIdController);

// Cập nhật thông tin khóa học
router.put("/:id", authMiddleware, adminMiddleware, upload.single("thumbnail"), updateCourseController);


// Thêm khóa học mới
router.post("/", authMiddleware, adminMiddleware, upload.single("thumbnail"), addCourseController);

// Xóa khóa học
router.delete("/:id", authMiddleware, adminMiddleware, deleteCourseController);

export default router;