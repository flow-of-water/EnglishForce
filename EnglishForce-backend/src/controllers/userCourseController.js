import * as userCourseModel from '../models/userCourseModel.js';
import * as courseModel from '../models/courseModel.js'
import * as userModel from '../models/userModel.js'

function ImgArrayToBase64(courses) {
  return courses.map(course => {
    if (course.thumbnail) {
      // Kiểm tra xem course.thumbnail có phải là Buffer không
      if (Buffer.isBuffer(course.thumbnail)) {
        course.thumbnail = course.thumbnail.toString("base64");
      }
    }
    return course;
  });
}
function ImgToBase64(course) {
  if (Buffer.isBuffer(course.thumbnail)) {
    course.thumbnail = course.thumbnail.toString("base64");
  }
  return course
}


// Tạo mới bản ghi user_course
export const createUserCourseController = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id ;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing userId or courseId' });
    }

    // Kiểm tra xem user đã đăng ký khóa học này chưa
    const existing = await userCourseModel.getUserCourse(userId, courseId);
    if (existing) {
      return res.status(400).json({ error: 'User already enrolled in this course.' });
    }

    const userCourse = await userCourseModel.createUserCourse(userId, courseId);
    res.status(201).json(userCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


export const createUserCoursesFromCartController = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const userId = req.user.id ;
    if (!userId || !Array.isArray(courseIds)) {
      return res.status(400).json({ error: 'Missing userId or courseIds array' });
    }

    const results = [];
    for (const courseId of courseIds) {
      // Kiểm tra xem user đã đăng ký khóa học này chưa
      const existing = await userCourseModel.getUserCourse(userId, courseId);
      if (existing) {
        results.push({ courseId, status: 'already enrolled' });
      } else {
        const newRecord = await userCourseModel.createUserCourse(userId, courseId);
        results.push({ courseId, status: 'enrolled', record: newRecord });
      }
    }
    return res.status(201).json({ results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// User review 
export const updateUserCourseRatingController = async (req,res) => { // PATCH METHOD
  try {
    var { courseId, rating, comment } = req.body;
    if(!comment) comment = null 
    if(!rating) rating = null
    
    const userId = req.user.id ;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing userId or courseIds array' });
    }
    const userCourse = await userCourseModel.updateUserCourse(userId,courseId,rating,comment) ;
    
    return res.status(200).json({ userCourse });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}



// Lấy danh sách các User_Course của một user
export const getUserCoursesController = async (req, res) => {
  try {
    const userId = req.user.id ;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    const userCourses = await userCourseModel.getUserCoursesByUser(userId);
    res.status(200).json(userCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa bản ghi user_course (hủy đăng ký khóa học)
export const deleteUserCourseController = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'Missing userId or courseId' });
    }
    const deleted = await userCourseModel.deleteUserCourse(userId, courseId);
    if (!deleted) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//
// Các hàm liên quan đến 2 bảng Users , Courses
//

// Lấy danh sách các khóa học của một user
export const getCoursesController = async (req, res) => {
  try {
    const userId = req.user.id ;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }
    var userCourses = await userCourseModel.getCoursesByUser(userId);
    userCourses = ImgArrayToBase64(userCourses)
    res.status(200).json(userCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getCourseOverviewController = async(req,res) => {
  try {
    const userId = req?.user?.id ;
    const { courseId } = req.params ;
    if (!courseId) {
      return res.status(400).json({ error: 'Missing CourseId' });
    }

    var course = await courseModel.getCourseById(courseId) ;
    var owned = null ;
    const reviews = await userCourseModel.getRatingsByCourseId(courseId);
    var overview = await userCourseModel.getOverviewRatingByCourseId(courseId) ;
    if(userId) owned= await userCourseModel.checkUserCourseExists(userId,courseId) ;

    if(!overview) overview ={
      "courseid": courseId,
      "average_rating": null,
      "total_rating": 0
    }
    
    var userCourse = null ;
    if (owned) userCourse = await userCourseModel.getUserCourse(userId,courseId) ;
    course = ImgToBase64(course) ;
    return res.status(200).json({
      course,
      owned, 
      reviews,
      overview,
      userCourse,
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


export const getStatisticsController = async(req,res) => {
  try {
    const totalUsers = await userModel.getNumberOfUsers() ;
    const totalCourses = await courseModel.getNumberOfCourses() ;
    const totalEnrollments = await userCourseModel.getNumberOfEnrollments() ;
    return res.status(200).json({
      totalCourses,
      totalEnrollments,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}