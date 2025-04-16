import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
} from '@mui/material';
import { Delete, Edit, Save, Close, Reply } from '@mui/icons-material';
import axiosInstance from '../Api/axiosInstance';

const Comments = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/comments/${courseId}`);
      setComments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !userId || !courseId) {
      alert('Please fill all information');
      return;
    }
    try {
      const newComment = { user_id: userId, course_public_id: courseId, content };
      await axiosInstance.post('/comments', newComment);
      setContent('');
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim()) return;
    try {
      await axiosInstance.post('/comments', {
        user_id: userId,
        course_id: courseId,
        content: replyContent,
        parent_comment_id: parentId,
      });
      setReplyingCommentId(null);
      setReplyContent('');
      fetchComments();
    } catch (err) {
      console.error('Error replying:', err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditingContent(content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async (commentId) => {
    try {
      await axiosInstance.patch(`/comments/${commentId}`, {
        content: editingContent,
      });
      setEditingCommentId(null);
      setEditingContent('');
      fetchComments();
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter((c) => c.parent_comment_id === parentId)
      .map((comment) => (
        <Box key={comment.id} sx={{ ml: level * 4 }}>
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <Typography variant="body2" color="text.primary">
                  {comment.username} — {new Date(comment.created_at).toLocaleString()}
                </Typography>
              }
              secondary={
                <>
                  {editingCommentId === comment.id ? (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                      <Box mt={1}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSaveEdit(comment.id)}
                          startIcon={<Save />}
                          sx={{ mr: 1 }}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={handleCancelEdit}
                          startIcon={<Close />}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      {comment.content}
                      <Box>
                        {!comment.parent_comment_id && (
                          <IconButton
                            size="small"
                            onClick={() => setReplyingCommentId(comment.id)}
                          >
                            <Reply fontSize="small" />
                          </IconButton>
                        )}
                        {comment.user_id == userId && (
                          <>
                            <IconButton
                              onClick={() => handleEdit(comment.id, comment.content)}
                              size="small"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDelete(comment.id)}
                              size="small"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </>
                  )}
                </>
              }
            />
          </ListItem>

          {replyingCommentId === comment.id && (
            <Box sx={{ ml: 4, mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Enter reply..."
              />
              <Button
                size="small"
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleReplySubmit(comment.id)}
              >
                Send Reply
              </Button>
            </Box>
          )}

          {renderComments(comment.id, level + 1)}
        </Box>
      ));
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 4 }} component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Your comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          variant="outlined"
          multiline
          rows={2}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Send comment
        </Button>
      </Paper>
      <List>
        {renderComments()}
      </List>
    </Box>
  );
};

export default Comments;
