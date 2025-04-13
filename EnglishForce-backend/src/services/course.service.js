import db from '../sequelize/models/index.js';
const { Course, UserCourse } = db;
const { Op, fn, col, literal } = db.Sequelize;

// Đếm số lượng khóa học
export const getNumberOfCourses = async () => {
  return await Course.count();
};

// Lấy toàn bộ danh sách khóa học
export const getCourses = async () => {
  return await Course.findAll({ raw: true });
};

// Tìm theo ID
export const getCourseById = async (id) => {
  return await Course.findByPk(id, { raw: true });
};

// Phân trang + tìm kiếm + kiểm tra đã mua
export const getPaginatedCourses = async (limit, offset, userId = null, q = "") => {
  let whereClause = {};
  if (q?.length >= 1) {
    whereClause = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${q}%` } },
        { author: { [Op.iLike]: `%${q}%` } },
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
    attributes: ['name', 'price', 'description', 'author'],
    limit,
    raw: true
  });
};

// Cập nhật toàn phần
export const updateCourse = async (id, name, instructor, description, thumbnail) => {
  const [count, [updated]] = await Course.update(
    { name, author: instructor, description, thumbnail },
    {
      where: { id },
      returning: true
    }
  );
  return updated?.get({ plain: true }) || null;
};

// Cập nhật từng phần (PATCH)
export const updateCoursePartial = async (id, updates) => {
  const [count, [updated]] = await Course.update(updates, {
    where: { id },
    returning: true
  });
  return updated?.get({ plain: true }) || null;
};

// Thêm khóa học mới
export const addCourse = async (name, instructor, description, price, thumbnail) => {
  const course = await Course.create({
    name,
    instructor,
    description,
    price,
    thumbnail
  });
  return course.get({ plain: true });
};

// Xóa khóa học
export const deleteCourse = async (id) => {
  const course = await Course.findByPk(id);
  if (!course) return null;

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
