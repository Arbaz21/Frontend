// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  Avatar,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchPosts, addPost, upvotePost, downvotePost } from '../Slices/postSlice';
import { fetchUser } from '../Slices/authSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const posts = useSelector((state) => state.post.posts);
  const loading = useSelector((state) => state.post.loading);
  const error = useSelector((state) => state.post.error);
  const user = useSelector((state) => state.auth.user);
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    dispatch(fetchUser()); // Fetch user data
    dispatch(fetchPosts()); // Fetch posts
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const postPayload = {
          title: values.title,
          content: values.content,
          visibility: 'Public',
          anonymous: anonymous
        };
        const newPost = await dispatch(addPost(postPayload)).unwrap();

        // Update local state immediately for anonymous posts
        if (newPost.anonymous) {
          newPost.createdBy = 'Anonymous';
        }

        dispatch({ type: 'post/addPostToState', payload: newPost });
        resetForm();
        setAnonymous(false); // Reset anonymous flag
      } catch (error) {
        console.error("Error creating post", error);
      }
    }
  });

  const handleDelete = async (postId) => {
    try {
      await axios.delete('http://localhost:3001/api/posts/deletepost', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        data: { postId }
      });
      dispatch(fetchPosts()); // Refresh posts after deletion
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleVote = async (postId, type) => {
    try {
      if (type === 'upvote') {
        await dispatch(upvotePost(postId)).unwrap();
      } else {
        await dispatch(downvotePost(postId)).unwrap();
      }
    } catch (error) {
      console.error(`Error handling ${type} vote`, error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  const getCreatedByText = (createdBy) => {
    if (typeof createdBy === 'object' && createdBy !== null) {
      return `${createdBy.firstname} ${createdBy.lastname}`;
    }
    return createdBy; // If it's not an object, return as is (could be 'Anonymous')
  };

  return (
    <Box sx={{
      marginTop: '20px',
      backgroundImage: 'url("background.jpeg")',
      backgroundSize: 'cover',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
              <IconButton>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                Sidebar
              </Typography>
              <Divider sx={{ marginBottom: '20px' }} />
              {/* Link to Teachers page */}
              <Button component={Link} to="/teachers" variant="contained" color="error" fullWidth sx={{ marginBottom: '10px' }}>Teachers</Button>
              {/* Link to Profile page */}
              <Button component={Link} to="/profile" variant="contained" color="error" fullWidth sx={{ marginBottom: '10px' }}>View Profile</Button>
              {/* Link to Courses page */}
              <Button component={Link} to="/courses" variant="contained" color="error" fullWidth sx={{ marginBottom: '10px' }}>Courses</Button>
              <Button variant="contained" color="secondary" fullWidth>Logout</Button>
            </Paper>
          </Grid>
          {/* Feed Section */}
          <Grid item xs={12} md={9}>
            {/* Post Form */}
            <Paper elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
              <Typography variant="h5" gutterBottom>
                What's on your mind?
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  id="title"
                  name="title"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  margin="normal"
                  sx={{ marginBottom: '20px' }}
                />
                <TextField
                  id="content"
                  name="content"
                  label="Content"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  error={formik.touched.content && Boolean(formik.errors.content)}
                  helperText={formik.touched.content && formik.errors.content}
                  margin="normal"
                  sx={{ marginBottom: '20px' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Post anonymously"
                />
                <Button type="submit" variant="contained" color="error">
                  Post
                </Button>
              </form>
            </Paper>
            {/* Display Posts */}
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && posts.map(post => (
              post && post.title && post.content && (
                <Paper key={post._id} elevation={3} sx={{ marginBottom: '20px', padding: '20px', border: '2px solid darkred' }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    onClick={() => navigate(`/post/${post._id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <strong>{post.title}</strong>
                  </Typography>
                  <ListItem alignItems="flex-start">
                    <Avatar alt={getCreatedByText(post.createdBy)} src="/static/images/avatar/1.jpg" sx={{ marginRight: '10px' }} />
                    <ListItemText
                      primary={post.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="textPrimary">
                            {post.content}
                          </Typography>
                          <Typography variant="caption" display="block" gutterBottom>
                            Posted by {getCreatedByText(post.createdBy)} • {formatDate(post.createdAt)}
                          </Typography>
                          <Typography variant="caption" display="block" gutterBottom>
                            {post.upvotes} upvotes • {post.downvotes} downvotes
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="upvote" onClick={() => handleVote(post._id, 'upvote')}>
                        <Badge badgeContent={post.upvotes} color="primary">
                          <ThumbUpAltIcon />
                        </Badge>
                      </IconButton>
                      <IconButton edge="end" aria-label="downvote" onClick={() => handleVote(post._id, 'downvote')}>
                        <Badge badgeContent={post.downvotes} color="error">
                          <ThumbDownAltIcon />
                        </Badge>
                      </IconButton>
                      {user && user.roles.includes('Admin') && (
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(post._id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                </Paper>
              )
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
