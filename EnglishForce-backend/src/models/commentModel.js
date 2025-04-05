import db from "../config/db.js";

export const getAllComments = async () => {
    const res = await db.query('SELECT * FROM comments');
    return res.rows;
};

export const getComments = async (offset, limit) => {
  try {
      const commentsQuery = `
          SELECT * 
          FROM comments
          ORDER BY created_at DESC
          LIMIT $1 OFFSET $2;
      `;
      const commentsResult = await db.query(commentsQuery, [limit, offset]);

      const totalCommentsQuery = `SELECT COUNT(*) FROM comments;`;
      const totalCommentsResult = await db.query(totalCommentsQuery);

      // Return the comments and the total count
      return {
          comments: commentsResult.rows,
          totalComments: parseInt(totalCommentsResult.rows[0].count),
      };
  } catch (error) {
      console.error("Error fetching comments from the database:", error);
      throw error;
  }
};

export const createComment = async (user_id, course_id, content, parent_comment_id=null) => {
    const res = await db.query(
        'INSERT INTO comments (user_id, course_id, content,parent_comment_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, course_id, content,parent_comment_id]
    );
    return res.rows[0];
};

export const deleteComment = async (id) => {
    const res = await db.query('DELETE FROM comments WHERE id = $1', [id]);
    return res.rowCount > 0;
};

export const updateComment = async (commentId, content) => {
  try {
    const res = await db.query(
      `UPDATE comments SET content = $1 WHERE id = $2 RETURNING *`,
      [content, commentId]
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error updating comment:", err);
    throw err;
  }
};


export const getDetailCommentsByCourseId = async (id) => {
    const query = `
    SELECT
      comments.*,
      users.username 
    FROM
      comments
    INNER JOIN
      users ON comments.user_id = users.id
    WHERE comments.course_id = $1
  `;
    const res = await db.query(query,[id]);
    return res.rows;
}