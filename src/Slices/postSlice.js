// src/slices/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Async actions
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await axios.get('http://localhost:3001/api/posts/getposts', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

export const addPost = createAsyncThunk('post/addPost', async (postData) => {
  const response = await axios.post('http://localhost:3001/api/posts/createpost', postData, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.post;
});

export const upvotePost = createAsyncThunk('post/upvotePost', async (postId) => {
  await axios.post(`http://localhost:3001/api/posts/upvotepost`, { postId }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return { postId, type: 'upvote' };
});

export const downvotePost = createAsyncThunk('post/downvotePost', async (postId) => {
  await axios.post(`http://localhost:3001/api/posts/downvotepost`, { postId }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return { postId, type: 'downvote' };
});

// Create slice
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
    addPostToState: (state, action) => {
      state.posts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload || [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        const newPost = action.payload;
        if (newPost && newPost.title && newPost.content) {
          if (newPost.anonymous) {
            newPost.createdBy = 'Anonymous';
          }
          state.posts.unshift(newPost);
        }
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.upvotes += 1;
        }
      })
      .addCase(downvotePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.posts.find((post) => post._id === postId);
        if (post) {
          post.downvotes += 1;
        }
      });
  },
});

export const { updatePosts, addPostToState } = postSlice.actions;
export default postSlice.reducer;
