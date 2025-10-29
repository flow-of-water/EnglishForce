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
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import { Delete, Edit, Save, Close, Reply } from '@mui/icons-material';
import axiosInstance from '../../Api/axiosInstance';
import CircularLoading from '../Loading';

const Comments = ({ coursePublicId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/comments/${coursePublicId}`);
      setComments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newComment = { user_id: userId, course_public_id: coursePublicId, content };
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
        course_public_id: coursePublicId,
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
      await axiosInstance.patch(`/comments/${commentId}`, { content: editingContent });
      setEditingCommentId(null);
      setEditingContent('');
      fetchComments();
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  if (loading) return <CircularLoading />;

  const renderComments = (parentId = null, level = 0) => {
    return comments
      .filter((c) => c.parent_comment_id === parentId)
      .map((comment) => (
        <Box
          key={comment.id}
          sx={{
            ml: level * 4,
            mt: 2,
            borderLeft: level > 0 ? '2px solid #e0e0e0' : 'none',
            pl: level > 0 ? 2 : 0,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 3,
              backgroundColor: '#fafafa',
              transition: 'all 0.2s ease',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <ListItem alignItems="flex-start" disableGutters>
              <Avatar
                src={comment.User?.avatar || '/2.png'}
                alt={comment.User?.username}
                sx={{ width: 42, height: 42, mr: 2 }}
              />
              <ListItemText
                primary={
                  <Typography variant="subtitle2" fontWeight={700}>
                    {comment.User.username}{' '}
                    <Typography component="span" variant="caption" color="text.secondary">
                      • {new Date(comment.created_at).toLocaleString()}
                    </Typography>
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
                          sx={{ mt: 1 }}
                        />
                        <Box mt={1}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Save />}
                            onClick={() => handleSaveEdit(comment.id)}
                            sx={{
                              mr: 1,
                              textTransform: 'none',
                              background: 'linear-gradient(to right, #1976d2, #00c6ff)',
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Close />}
                            onClick={handleCancelEdit}
                            sx={{ textTransform: 'none' }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
                          {comment.content}
                        </Typography>
                        <Box>
                          {!comment.parent_comment_id && (
                            <Tooltip title="Reply" arrow>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setReplyingCommentId(
                                    replyingCommentId === comment.id ? null : comment.id
                                  )
                                }
                              >
                                <Reply fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {comment.user_id == userId && (
                            <>
                              <Tooltip title="Edit" arrow>
                                <IconButton size="small" onClick={() => handleEdit(comment.id, comment.content)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete" arrow>
                                <IconButton size="small" onClick={() => handleDelete(comment.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </>
                    )}
                  </>
                }
              />
            </ListItem>

            {/* Reply Input */}
            {replyingCommentId === comment.id && (
              <Box sx={{ mt: 2, ml: 6 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                />
                <Box mt={1}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleReplySubmit(comment.id)}
                    sx={{
                      mr: 1,
                      textTransform: 'none',
                      background: 'linear-gradient(to right, #1976d2, #00c6ff)',
                    }}
                  >
                    Send
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={() => {
                      setReplyingCommentId(null);
                      setReplyContent('');
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Recursive replies */}
          {renderComments(comment.id, level + 1)}
        </Box>
      ));
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* New Comment Box */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Leave a Comment
        </Typography>
        <TextField
          fullWidth
          label="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          multiline
          rows={2}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            px: 4,
            py: 1,
            textTransform: 'none',
            borderRadius: 3,
            fontWeight: 600,
            background: 'linear-gradient(to right, #1976d2, #00c6ff)',
            '&:hover': {
              background: 'linear-gradient(to right, #1565c0, #00bcd4)',
            },
          }}
        >
          Post Comment
        </Button>
      </Paper>

      {/* Comment List */}
      <List disablePadding>{renderComments()}</List>
    </Box>
  );
};

export default Comments;
