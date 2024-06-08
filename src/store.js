// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice'; // Update path
import teacherReducer from './Slices/teacherSlice'; // Update path
import courseReducer from './Slices/courseSlice'; // Update path
import postReducer from './Slices/postSlice'; // Update path
import profileReducer from './Slices/profileSlice'; // Update path

const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    course: courseReducer,
    post: postReducer, // Ensure this matches the name used in `HomePage.js`
    profile: profileReducer,
  },
});

export default store;
