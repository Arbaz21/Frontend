// src/Slices/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for fetching courses
export const fetchCourses = createAsyncThunk('course/fetchCourses', async () => {
  const response = await axios.get('http://localhost:3001/api/courses/getallcourses', {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.courses;
});

// Async action for adding a new course
export const addCourse = createAsyncThunk('course/addCourse', async (courseData) => {
  const response = await axios.post('http://localhost:3001/api/courses', courseData, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.course;
});

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.push(action.payload);
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default courseSlice.reducer;
