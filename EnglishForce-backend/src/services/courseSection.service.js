import db from '../sequelize/models/index.js';
const { CourseSection } = db;

// Tạo section mới
export async function create(name, course_id, video_link, order_index, description) {
  const section = await CourseSection.create({
    name,
    course_id,
    video_link,
    order_index,
    description
  });
  return section.get({ plain: true });
}

// Lấy tất cả section (theo thứ tự)
export async function getAll() {
  const sections = await CourseSection.findAll({
    order: [['order_index', 'ASC']]
  });
  return sections.map(s => s.get({ plain: true }));
}

// Lấy section theo courseId
export async function getAllByCourseId(course_id) {
  const sections = await CourseSection.findAll({
    where: { course_id },
    order: [['order_index', 'ASC']]
  });
  return sections.map(s => s.get({ plain: true }));
}

// Lấy section theo id
export async function getById(id) {
  const section = await CourseSection.findByPk(id);
  return section ? section.get({ plain: true }) : null;
}

// Xóa section theo id
export async function deleteSection(id) {
  const deletedCount = await CourseSection.destroy({
    where: { id }
  });
  return deletedCount > 0;
}

// Xóa tất cả section của 1 course
export async function deleteSectionsByCourseId(course_id) {
  const deleted = await CourseSection.destroy({
    where: { course_id },
    returning: true
  });
  // Sequelize không luôn trả về rows nếu không phải Postgres, nên optional
  return deleted; // có thể là số lượng nếu không dùng returning
}

// Cập nhật section
export const updateCourseSection = async (id, name, description, video_link, order_index) => {
  try {
    const [count, [updatedSection]] = await CourseSection.update(
      { name, description, video_link, order_index },
      {
        where: { id },
        returning: true
      }
    );
    return updatedSection?.get({ plain: true }) || null;
  } catch (error) {
    throw new Error("Error updating course section: " + error.message);
  }
};
