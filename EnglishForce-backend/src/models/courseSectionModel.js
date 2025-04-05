import db from "../config/db.js";

export async function create(name, course_id, video_link, order_index ,description ) {
    const query = `INSERT INTO course_sections (name, course_id, video_link, order_index, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [name, course_id, video_link, order_index,description];
    const result = await db.query(query, values);
    return result.rows[0];
}

export async function getAll() {
    const result = await db.query("SELECT * FROM course_sections ORDER BY order_index");
    return result.rows;
}
export async function getAllByCourseId(id) {
    const result = await db.query("SELECT * FROM course_sections where course_id = $1 ORDER BY order_index",[id]);
    return result.rows;
}

export async function getById(id) {
    const result = await db.query("SELECT * FROM course_sections WHERE id = $1", [id]);
    return result.rows[0] || null;
}

export async function deleteSection(id) {
    const result = await db.query("DELETE FROM course_sections WHERE id = $1 RETURNING *", [id]);
    return result.rowCount > 0;
}

export async function deleteSectionsByCourseId(course_id) {
  const result = await db.query(
    'DELETE FROM course_sections WHERE course_id = $1 RETURNING *',
    [course_id]
  );
  return result.rows;
}

export const updateCourseSection = async (id, name, description, video_link, order_index) => {
    try {
      const result = await db.query(
        `UPDATE course_sections
         SET name = $1, description = $2, video_link = $3, order_index = $4
         WHERE id = $5
         RETURNING *`,
        [name, description, video_link, order_index, id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating course section: " + error.message);
    }
  };