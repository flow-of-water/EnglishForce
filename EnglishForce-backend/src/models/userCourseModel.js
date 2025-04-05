import db from '../config/db.js';
import format from 'pg-format';


// Tạo bản ghi mới cho bảng user_course
export const createUserCourse = async (userId, courseId) => {
  const query = `
    INSERT INTO user_course (userid, courseid)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [userId, courseId];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const updateUserCourse = async (userId, courseId,rating,comment) => {
  const query = `UPDATE user_course SET rating = $1, comment = $2 where userid = $3 and courseid = $4`
  const { rows } = await db.query(query, [rating,comment,userId,courseId]);
  return rows[0];
}

// Count the number of rows in user_course 
export const getNumberOfEnrollments = async()=> {
  const result = await db.query("SELECT COUNT(*) FROM user_course") ;
  return result.rows[0].count ;
}

// Lấy tất cả các khóa học của một user
export const getUserCoursesByUser = async (userId) => {
  const query = `
    SELECT * FROM user_course
    WHERE userid = $1;
  `;
  const values = [userId];
  const { rows } = await db.query(query, values);
  return rows;
};

// Lấy ratings của 1 course
export const getRatingsByCourseId = async (courseId) => {
  const query = `
    SELECT 
        u.username AS username,
        uc.rating AS rating,
        uc.comment AS comment
    FROM user_course uc
    JOIN users u ON uc.userid = u.id 
    JOIN courses c ON uc.courseid = c.id 
    WHERE c.id = $1 ;
  `;
  const { rows } = await db.query(query, [courseId]);
  return rows;
};
export const getOverviewRatingByCourseId = async (courseId) => {
  const query = `
    SELECT 
        uc.courseid,
        ROUND(AVG(uc.rating), 2) AS average_rating,
        COUNT(uc.rating) AS total_rating
    FROM user_course uc
    WHERE uc.courseid = $1 
    GROUP BY uc.courseid;
`;
  const { rows } = await db.query(query, [courseId]);
  return rows.length > 0 ? rows[0] : null;
}

// Lấy bản ghi của user trong khóa học cụ thể
export const getUserCourse = async (userId, courseId) => {
  const query = `
    SELECT * FROM user_course
    WHERE userid = $1 AND courseid = $2;
  `;
  const values = [userId, courseId];
  const { rows } = await db.query(query, values);
  return rows[0];
};

// Xóa bản ghi của user_course
export const deleteUserCourse = async (userId, courseId) => {
  const query = `
    DELETE FROM user_course
    WHERE userid = $1 AND courseid = $2
    RETURNING *;
  `;
  const values = [userId, courseId];
  const { rows } = await db.query(query, values);
  return rows[0];
};



// Hàm thêm nhiều bản ghi vào bảng user_course
export const addUserCourses = async (userId, courseIds) => {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    throw new Error('courseIds phải là một mảng chứa ít nhất một phần tử.');
  }

  // Tạo mảng các giá trị [userId, courseId]
  const values = courseIds.map(courseId => [userId, courseId]);

  // Tạo truy vấn SQL với pg-format
  const query = format('INSERT INTO user_course (userid, courseid) VALUES %L RETURNING *;', values);

  try {
    const { rows } = await db.query(query);
    return rows;
  } catch (error) {
    console.error('Lỗi khi thêm user_courses:', error);
    throw new Error('Không thể thêm user_courses.');
  }
};



// Các Hàm liên quan đến 2 bảng Users , Courses 

export const getCoursesByUser = async (userId) => {
  const query = `
    SELECT c.*
    FROM courses c
    JOIN user_course uc ON c.id = uc.courseid
    JOIN users u ON uc.userid = u.id
    WHERE u.id = $1;
  `;
  const values = [userId];
  try {
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error('Lỗi khi truy vấn danh sách khóa học:', err);
    throw err;
  }
}

export const checkUserCourseExists = async (userId, courseId) => {
  const query = `
      SELECT EXISTS (
          SELECT 1 FROM user_course 
          WHERE userid = $1 AND courseid = $2
      ) AS exists;
  `;
  const result = await db.query(query, [userId, courseId]);
  return result.rows[0].exists; // Trả về true hoặc false
};