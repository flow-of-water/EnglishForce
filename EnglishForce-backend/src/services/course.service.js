import db from '../sequelize/models/index.js';
const { Course, UserCourse, CourseSection } = db;
const { Op, fn, col, literal } = db.Sequelize;
import { deleteCloudinaryFile } from '../config/cloudinary.config.js';

export const findCourseIdByPublicId = async (publicId) => {
  const course = await Course.findOne({ where: { public_id: publicId } });
  if (!course) throw new Error('Course not found with that public_id');
  return course.id ;
}
export const findCourseByPublicId = async (publicId) => {
  const course = await Course.findOne({ where: { public_id: publicId } });
  if (!course) throw new Error('Course not found with that public_id');
  
  return course ;
}

// Đếm số lượng khóa học
export const getNumberOfCourses = async () => {
  return await Course.count();
};

export const getCourses = async () => {
  return await Course.findAll({ raw: true });
};


// Tìm theo Real ID
export const getCourseById = async (id) => {
  return await Course.findByPk(id, { raw: true });
};

// Tìm theo Public ID
export const getCourseByPublicId = async (publicId) => {
  return await Course.findByPublicId(publicId) ;
};

// Phân trang + tìm kiếm + kiểm tra đã mua
export const getPaginatedCourses = async (limit, offset, userId = null, q = "") => {
  let whereClause = {};
  if (q?.length >= 1) {
    whereClause = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${q}%` } },
        { instructor: { [Op.iLike]: `%${q}%` } },
      ]
    };
  }

  const { count, rows } = await Course.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['id', 'ASC']],
    raw: true
  });

  let courses = rows;

  // Nếu có userId, thêm flag is_purchased
  if (userId) {
    const purchased = await UserCourse.findAll({
      where: { user_id: userId },
      attributes: ['course_id'],
      raw: true
    });

    const purchasedIds = new Set(purchased.map(p => p.course_id));
    courses = courses.map(c => ({
      ...c,
      is_purchased: purchasedIds.has(c.id)
    }));
  }

  return {
    courses,
    totalItems: count
  };
};

// Tìm kiếm khóa học
export const searchCourses = async (query) => {
  return await Course.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { author: { [Op.iLike]: `%${query}%` } }
      ]
    },
    raw: true
  });
};

// Tìm kiếm khóa học trong câu
export const searchCourseInSentences = async (sentence, limit = 5) => {
  return await Course.findAll({
    where: literal(`'${sentence}' ILIKE '%' || name || '%'`),
    attributes: ['name', 'price', 'description', 'instructor'],
    limit,
    raw: true
  });
};

// Cập nhật từng phần (PATCH)
export const updateCourseWithMedia = async (id, body, file) => {
  const course = await Course.findByPk(id);
  if (!course) return null;

  const updates = { ...body };

  // Nếu có file ảnh mới được upload
  if (file && file.path) {
    if (course.thumbnail_public_id) {
      await deleteCloudinaryFile(course.thumbnail_public_id, 'image');
    }

    updates.thumbnail = file.path;
    updates.thumbnail_public_id = file.filename;
  }

  const [count, [updated]] = await Course.update(updates, {
    where: { id },
    returning: true
  });

  return updated?.get({ plain: true }) || null;
};



// Thêm khóa học mới
export const addCourse = async (name, instructor, description, price, thumbnail, thumbnail_public_id) => {
  const course = await Course.create({
    name,
    instructor,
    description,
    price,
    thumbnail,
    thumbnail_public_id
  });
  return course.get({ plain: true });
};

// Xóa khóa học
export const deleteCourse = async (id) => {
  const course = await Course.findByPk(id,{
    include: [
      {
        model: CourseSection,
        as: 'CourseSections'
      }
    ]
  });
  console.log(course) ;
  console.log(course.CourseSections)
  if (!course) return null;

  if (course.thumbnail_public_id) 
    await deleteCloudinaryFile(course.thumbnail_public_id, 'image');
  for (const section of course.CourseSections || []) {
    if (section.video_public_id) 
      await deleteCloudinaryFile(section.video_public_id, 'video');
  }
  await course.destroy();
  return course.get({ plain: true });
};

// Tính tổng giá theo danh sách courseId
export const getTotalPriceByCourseIds = async (courseIds) => {
  if (!Array.isArray(courseIds) || courseIds.length === 0) return 0;

  const result = await Course.findOne({
    attributes: [[fn('SUM', col('price')), 'total_price']],
    where: { id: { [Op.in]: courseIds } },
    raw: true
  });

  return parseFloat(result.total_price) || 0;
};
