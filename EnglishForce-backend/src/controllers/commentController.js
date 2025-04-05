import * as commentModel from "../models/commentModel.js" ;

// Lấy tất cả bình luận
export const getAllCommentsController = async (req, res) => {
    try {
        const comments = await commentModel.getAllComments();
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPaginatedCommentsController = async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10; 
    const offset = (page - 1) * limit; 

    try {
        const { comments, totalComments } = await commentModel.getComments(offset, limit);

        const totalPages = Math.ceil(totalComments / limit);

        res.json({
            comments,
            totalPages,
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).send("Server error");
    }
};

export const getDetailCommentsByCourseIdController = async (req, res) => {
    try {
        const { courseId } = req.params;
        const comments = await commentModel.getDetailCommentsByCourseId(courseId);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tạo bình luận mới
export const createComment = async (req, res) => {
    const { user_id, course_id, content, parent_comment_id = null } = req.body;
    try {
        const newComment = await commentModel.createComment(user_id, course_id, content,parent_comment_id);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editCommentController = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
  
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
  
    try {
      const updatedComment = await commentModel.updateComment(commentId, content);
      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(updatedComment);
    } catch (error) {
      res.status(500).json({ message: "Error updating comment" });
    }
  };

// Xóa bình luận
export const deleteCommentController = async (req, res) => {
    const { id } = req.params;
    try {
        const success = await commentModel.deleteComment(id);
        if (success) {
            res.status(200).json({ message: 'Bình luận đã được xóa.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bình luận.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

