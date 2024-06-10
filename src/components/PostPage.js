// src/components/PostPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, postComment, fetchComments, upvotePost, downvotePost } from '../slices/postSlice';
import {
  Box, Container, Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction,
  IconButton, Avatar, TextField, Button, FormControlLabel, Checkbox, CircularProgress
} from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, loading, error } = useSelector(state => state.post);
  const [commentText, setCommentText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isFetchingComments, setIsFetchingComments] = useState(false); // New state for fetching comments

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    dispatch(fetchPostById(postId));
    dispatch(fetchComments(postId)); // Fetch comments when the component mounts
  }, [dispatch, postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setIsCommentLoading(true);
    try {
      await dispatch(postComment({ postId, commentText, anonymous })).unwrap();
      setCommentText('');
      setAnonymous(false);
      toast.success('Comment posted successfully');
      
      // Refresh comments after posting
      await dispatch(fetchComments(postId)).unwrap();
    } catch (err) {
      toast.error('Failed to post comment');
    } finally {
      setIsCommentLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      if (voteType === 'upvote') {
        await dispatch(upvotePost(postId)).unwrap();
      } else if (voteType === 'downvote') {
        await dispatch(downvotePost(postId)).unwrap();
      }
    } catch (error) {
      toast.error(`Failed to ${voteType} post`);
    }
  };

  const handleDeleteComment = (commentId) => {
    // Implement delete comment functionality here
  };


  if (loading) {
    // return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <Box sx={{ marginTop: '20px', padding: '20px' }}>
      <Container maxWidth="lg">
        <ToastContainer />
        {post && (
          <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
            <Typography variant="h5" gutterBottom>
              <strong>{post.title}</strong>
            </Typography>
            <List>
              <ListItem alignItems="flex-start">
                <Avatar alt={post.createdBy} src="/static/images/avatar/1.jpg" sx={{ marginRight: '10px' }} />
                <ListItemText
                  primary={post.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {post.content}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom>
                        Posted by {post.createdBy} • {post.createdAt}
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom>
                        {post.upvotes} upvotes • {post.downvotes} downvotes
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="upvote" onClick={() => handleVote('upvote')}>
                    <ThumbUpAltIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="downvote" onClick={() => handleVote('downvote')}>
                    <ThumbDownAltIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        )}
        <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
          <Typography variant="h5" gutterBottom>
            Add a comment
          </Typography>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              name="commentText"
              label="Add a comment"
              variant="outlined"
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              margin="normal"
              sx={{ marginBottom: '20px' }}
              disabled={isCommentLoading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  color="error"
                  disabled={isCommentLoading}
                />
              }
              label="Post Anonymously"
            />
            <Button type="submit" variant="contained" color="error" disabled={isCommentLoading}>
              {isCommentLoading ? <CircularProgress size={24} color="inherit" /> : 'Comment'}
            </Button>
          </form>
        </Paper>
        {post && post.comments && post.comments.length > 0 ? (
          post.comments.slice().reverse().map(comment => (
            <Paper key={comment._id} elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
              <ListItem alignItems="flex-start">
                <Avatar alt={comment.name} src="/static/images/avatar/1.jpg" />
                <ListItemText
                  primary={comment.comment}
                  secondary={
                    <>
                      <Typography variant="caption" display="block" gutterBottom>
                        Comment by {comment.anonymous ? 'Anonymous' : comment.name} • {comment.createdAt}
                      </Typography>
                    </>
                  }
                />
                {(user && (user.role === 'Admin' || user.erp === comment.erp)) && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteComment(comment._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Paper>
          ))
        ) : (
          <Typography>No comments yet.</Typography>
        )}
      </Container>
    </Box>
  );
};

export default PostPage;
