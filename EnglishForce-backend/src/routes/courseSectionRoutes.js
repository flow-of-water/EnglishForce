import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authorize.js";  
import {
    createCourseSection,
    getAllCourseSections,
    getAllCourseSectionsByCourseId,
    getCourseSectionById,
    deleteCourseSection,
    updateCourseSection
} from "../controllers/courseSectionController.js";

const router = express.Router();


// Lấy tất cả course sections
router.get("/",authMiddleware, getAllCourseSections);

// Lấy một course section theo ID
router.get("/:id",authMiddleware, getCourseSectionById);

// Lấy tất cả sections theo course_id
router.get("/course/:course_id",authMiddleware, getAllCourseSectionsByCourseId);

// Tạo một course section mới
router.post("/",authMiddleware, adminMiddleware, createCourseSection);


// Xóa một course section theo ID
router.delete("/:id",authMiddleware, adminMiddleware, deleteCourseSection);

// Cập nhật course section theo sectionId
router.put("/:id", authMiddleware, adminMiddleware, updateCourseSection);

export default router;
