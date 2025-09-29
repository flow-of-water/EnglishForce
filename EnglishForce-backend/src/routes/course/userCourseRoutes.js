import express from 'express';
import {
  createUserCourseController,
  getCoursesController,
  deleteUserCourseController,
  createUserCoursesFromCartController,
  getCourseOverviewController,
  getStatisticsController,
  updateUserCourseRatingController,
  updateNotes,
  getNotesByCoursePublicId
} from '../../controllers/course/userCourseController.js';
import { authMiddleware , adminMiddleware, authMiddlewareWithoutError } from '../../middleware/authorize.js';

const router = express.Router();

// POST /api/user-course - Tạo mới bản ghi user_course
router.post('/', authMiddleware, createUserCourseController);
router.patch('/rating',authMiddleware,updateUserCourseRatingController);

router.post('/cart', authMiddleware, createUserCoursesFromCartController);

// GET /api/user-course/:userId - Lấy tất cả User-Course của một user
router.get('/user', authMiddleware, getCoursesController);

// User Notes 
router.put('/notes/:coursePublicId', authMiddleware, updateNotes )
router.get("/notes/:coursePublicId", authMiddleware, getNotesByCoursePublicId);

// GET /api/user-course/statistics - Lấy thống kê hệ thống cho admin 
router.get('/statistics',authMiddleware,adminMiddleware,getStatisticsController) ;

router.get('/course-overview/:coursePublicId',authMiddlewareWithoutError, getCourseOverviewController);
// DELETE /api/user-course/:userId/:courseId - Xóa bản ghi user_course
router.delete('/:userId/:courseId', authMiddleware, deleteUserCourseController);

export default router;
