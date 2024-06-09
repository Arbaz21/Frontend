// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import Profile from './components/Profile';
import TeacherList from './components/TeacherList';
import TeacherProfile from './components/TeacherProfile';
import CoursePage from './components/CoursePage';
import PostPage from './components/PostPage';
import { fetchUser } from './slices/authSlice';
import Sidebar from './common/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import './assets/styles/App.css'; // Adjust the path as per your project structure

const drawerWidth = 240;

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    {isAuthenticated && <Sidebar />}
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, ml: isAuthenticated ? `${drawerWidth}px` : '0' }}
    >
      <Toolbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={Profile} />} />
        <Route path="/teachers" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={TeacherList} />} />
        <Route path="/teachers/:teacherId" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={TeacherProfile} />} />
        <Route path="/courses" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={CoursePage} />} />
        <Route path="/posts" element={<ProtectedRoute isAuthenticated={isAuthenticated} component={PostPage} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Box>
  </Box>
</Router>

  );
};

// ProtectedRoute Component
const ProtectedRoute = ({ isAuthenticated, component: Component, ...rest }) => {
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default App;
