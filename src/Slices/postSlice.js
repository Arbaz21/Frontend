// src/Slices/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for fetching posts
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await axios.get('http://localhost:3001/api/posts/getposts', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
});

// Async action for adding a new post
export const addPost = createAsyncThunk('post/addPost', async (postData) => {
  const response = await axios.post('http://localhost:3001/api/posts/createpost', postData, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.post; // Return the full post object
});

// Async action for upvoting a post
export const upvotePost = createAsyncThunk('post/upvotePost', async (postId) => {
  const response = await axios.post(`http://localhost:3001/api/posts/upvotepost`, { postId }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return { postId, type: 'upvote' }; // Return postId and vote type
});

// Async action for downvoting a post
export const downvotePost = createAsyncThunk('post/downvotePost', async (postId) => {
  const response = await axios.post(`http://localhost:3001/api/posts/downvotepost`, { postId }, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return { postId, type: 'downvote' }; // Return postId and vote type
});

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [], // Initialize posts as an empty array
    loading: false,
    error: null,
  },
  reducers: {
    updatePosts: (state, action) => {
      state.posts = action.payload;
    },
    addPostToState: (state, action) => {
      state.posts.unshift(action.payload); // Add new post to the beginning
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload || []; // Ensure payload is an array
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
            newPost.createdBy = 'Anonymous'; // Set createdBy to 'Anonymous' immediately
          }
          state.posts.unshift(newPost); // Add new post to the beginning
        }
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(upvotePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        // Find the post and update its upvotes
        const post = state.posts.find(post => post._id === postId);
        if (post) {
          post.upvotes += 1;
        }
      })
      .addCase(downvotePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        // Find the post and update its downvotes
        const post = state.posts.find(post => post._id === postId);
        if (post) {
          post.downvotes += 1;
        }
      });
  },
});

export const { updatePosts, addPostToState } = postSlice.actions;
export default postSlice.reducer;
